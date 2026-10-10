/**
 * Bundle smoke test.
 *
 * Loads `client/client.js` exactly the way the host does — `window.__ModuleLoader__`
 * with a `require` that resolves the platform modules — then applies the plugin
 * against a minimal fake Cordis context and drives the real reminder surface.
 *
 * This is the closest thing to a browser run that works without a display: it
 * catches bundle-shape mistakes, JSX/external resolution problems, DOM wiring
 * errors and lifecycle leaks.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUNDLE = resolve(root, 'client/client.js');

/** Minimal Element/Node stand-in: enough for the surface's DOM calls. */
class FakeNode {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = { display: '' };
    this.dataset = {};
    this.textContent = '';
    this.parent = null;
  }
  set className(value) { this.attributes.set('class', value); }
  get className() { return this.attributes.get('class') ?? ''; }
  set id(value) { this.attributes.set('id', value); }
  get id() { return this.attributes.get('id') ?? ''; }
  set innerHTML(value) { this._innerHTML = value; }
  get innerHTML() { return this._innerHTML ?? ''; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  append(...nodes) { for (const node of nodes) { node.parent = this; this.children.push(node); } }
  prepend(...nodes) { for (const node of nodes.slice().reverse()) { node.parent = this; this.children.unshift(node); } }
  appendChild(node) { this.append(node); return node; }
  remove() {
    if (!this.parent) return;
    const index = this.parent.children.indexOf(this);
    if (index >= 0) this.parent.children.splice(index, 1);
    this.parent = null;
  }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  dispatch(type) {
    const event = { currentTarget: this, preventDefault() {}, stopPropagation() {} };
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  scrollIntoView() {}
  focus() {}
  /** Depth-first search by predicate, for assertions. */
  find(predicate) {
    if (predicate(this)) return this;
    for (const child of this.children) {
      const hit = child.find?.(predicate);
      if (hit) return hit;
    }
    return null;
  }
  findAll(predicate, found = []) {
    if (predicate(this)) found.push(this);
    for (const child of this.children) child.findAll?.(predicate, found);
    return found;
  }
  findClass(name) { return this.find(node => node.className.split(/\s+/).includes(name)); }
  findByClassText(name) { return this.findAll(node => node.className.split(/\s+/).includes(name)).map(node => node.textContent); }
  contains(node) {
    if (node === this) return true;
    return this.children.some(child => child.contains?.(node) === true);
  }
}

/** Install a browser-ish global surface; returns the localStorage record. */
function installBrowserEnv({ language = 'zh-CN' } = {}) {
  const stored = new Map();
  const head = new FakeNode('head');
  const body = new FakeNode('body');
  const document = {
    documentElement: { lang: language },
    hidden: false,
    head,
    body,
    createElement: tagName => new FakeNode(tagName),
    createElementNS: (_ns, tagName) => new FakeNode(tagName),
    addEventListener() {},
    removeEventListener() {},
  };

  const previous = {};
  const globals = {
    window: { innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} },
    document,
    navigator: { language },    localStorage: {
      getItem: key => (stored.has(key) ? stored.get(key) : null),
      setItem: (key, value) => { stored.set(key, String(value)); },
      removeItem: key => { stored.delete(key); },
    },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: callback => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: handle => clearTimeout(handle),
    Notification: undefined,
    AudioContext: undefined,
  };
  for (const [key, value] of Object.entries(globals)) {
    previous[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  return {
    stored,
    document,
    restore() {
      for (const [key, descriptor] of Object.entries(previous)) {
        if (descriptor === undefined) delete globalThis[key];
        else Object.defineProperty(globalThis, key, descriptor);
      }
    },
  };
}

/**
 * The host evaluates the bundle with `window` in scope and a `require` bound to
 * the platform module table. React is stubbed closely enough to run real
 * function components: `useEffect` callbacks are collected and can be flushed.
 */
async function loadPlugin() {
  const source = await readFile(BUNDLE, 'utf8');
  let captured = null;
  const effects = [];
  const react = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useRef: initial => ({ current: initial }),
    useCallback: callback => callback,
    useEffect: (callback, deps) => { effects.push({ callback, deps }); },
  };
  const requireShim = id => {
    if (id === 'react') return react;
    if (id === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null, Fragment: 'Fragment' };
    if (id === 'react-dom') return { createPortal: node => node };
    if (id === '@deepseek-ai/dsh-client-ui-primitives') return {};
    throw new Error(`unexpected external module: ${id}`);
  };
  const window = { __ModuleLoader__: { load: ({ id, factory }) => { captured = { id, exports: factory(requireShim) }; } } };
  // eslint-disable-next-line no-new-func -- the host evaluates this bundle the same way.
  new Function('window', source)(window);
  assert.ok(captured, 'the bundle must call window.__ModuleLoader__.load');
  /** Run every collected effect callback (mount) and return their cleanups. */
  const flushEffects = () => effects.splice(0).map(({ callback }) => callback());
  return { ...captured, flushEffects };
}

/** Poll a synchronous condition (the engine's timer is real, so give it a moment). */
async function waitFor(read, { timeoutMs = 2500, intervalMs = 20 } = {}) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const value = read();
    if (value) return value;
    if (Date.now() > deadline) return value;
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
}

/** Minimal Cordis context: records slot registrations and lifecycle effects. */function createFakeContext() {
  const registrations = [];
  const effects = [];
  const injections = [];
  const locale = {
    language: 'zh-CN',
    getLocale: () => ({ id: 'zh-CN', language: 'zh-CN' }),
    getSnapshot: () => ({ id: 'zh-CN', language: 'zh-CN' }),
    subscribe: () => () => {},
  };
  const ctx = {
    locale,
    slots: {
      inject(key, callback) { injections.push(key); return callback() ?? (() => {}); },
      register(options, component) { registrations.push({ options, component }); return () => {}; },
    },
    effect(callback) { effects.push(callback); return () => {}; },
  };
  return {
    ctx,
    registrations,
    injections,
    find(id) { return registrations.find(entry => entry.options.id === id); },
    findSlot(name) { return registrations.find(entry => entry.options.name === name); },
    /** Run the plugin's own ctx.effect callbacks and collect their disposers. */
    lifecycleDisposers() { return effects.map(effect => effect()); },
  };
}

/**
 * Boot the plugin the way the host does and mount the overlay.
 * Always returns a `stop()` that is safe to call more than once, so a failing
 * assertion can never leave an interval running and hang the test process.
 */
async function boot({ seed } = {}) {
  const env = installBrowserEnv();
  if (seed) {
    for (const [key, value] of Object.entries(seed)) env.stored.set(key, value);
  }
  const { exports: api, flushEffects } = await loadPlugin();
  const fake = createFakeContext();
  api.apply(fake.ctx);
  fake.find('stand-reminder').component();
  const cleanups = flushEffects();
  const root = env.document.body.children.find(node => node.id === 'dsh-stand-reminder-root');
  let stopped = false;
  return {
    env,
    api,
    fake,
    root,
    stop() {
      if (stopped) return;
      stopped = true;
      for (const cleanup of cleanups) cleanup();
      for (const dispose of fake.lifecycleDisposers()) dispose();
      env.restore();
    },
  };
}

test('the bundle registers itself through the host protocol', async () => {
  const env = installBrowserEnv();
  try {
    const plugin = await loadPlugin();
    assert.equal(plugin.id, 'dsh-plugin-stand-reminder');
    const api = plugin.exports;
    assert.equal(typeof api.apply, 'function', 'the factory must export apply');
    assert.deepEqual([...api.inject], ['slots', 'locale'], 'hard dependencies must be declared');
    assert.match(api.name, /stand-reminder/);
  } finally {
    env.restore();
  }
});

test('apply registers exactly the overlay and the settings section', async () => {
  const booted = await boot();
  try {
    const { fake, root } = booted;
    assert.deepEqual([...fake.injections].sort(), ['settings.section', 'shell.overlay']);

    const overlay = fake.find('stand-reminder');
    assert.ok(overlay, 'the overlay entry must be registered');
    assert.equal(overlay.options.name, 'shell.overlay');
    assert.equal(overlay.options.id, 'stand-reminder');
    assert.equal(overlay.options.order, 60);
    assert.equal(overlay.options.label(), '久坐提醒');

    const section = fake.findSlot('settings.section');
    assert.ok(section, 'the settings section must be registered');
    assert.equal(section.options.id, 'stand-reminder');
    assert.equal(section.options.order, 35);
    // The injected translator is used detached from the store, so it must not
    // rely on being called as a method.
    const { t } = section.options.inject();
    assert.equal(typeof t, 'function', 'the section must inject a translator');
    assert.equal(t('settings.title'), '久坐提醒', 'the injected translator must actually resolve');
    const sectionComponent = section.component;
    assert.equal(typeof sectionComponent, 'function', 'the section entry must be a React component');

    assert.ok(root, 'the surface root must be appended to body on mount');
    assert.ok(root.findClass('dsr-pill'), 'the corner countdown must render');

    assert.equal(typeof overlay.component, 'function', 'the overlay entry is a component');
    assert.equal(overlay.component(), null, 'the slot itself renders nothing');
  } finally {
    booted.stop();
    assert.equal(booted.env.document.body.children.length, 0, 'teardown must remove the surface');
  }
});

test('the surface reminds, snoozes and stands up through the bundle', async () => {
  // Seed a deadline that is already past: the first tick must fire. This is the
  // "the tab sat closed over lunch" path, exercised end to end.
  const stamp = Date.parse('2026-03-02T09:00:00');
  const booted = await boot({
    seed: {
      'dsh-plugin-stand-reminder:v1:settings': JSON.stringify({
        intervalMinutes: 1,
        messageMode: 'custom',
        customMessages: ['站起来走两步'],
        sound: false,
      }),
      'dsh-plugin-stand-reminder:v1:runtime': JSON.stringify({
        lastStandAt: stamp,
        nextDueAt: stamp - 1000,
        todayKey: '2026-03-02',
      }),
    },
  });
  try {
    const { env, root } = booted;
    const pill = root.findClass('dsr-pill');
    assert.ok(pill, 'the countdown pill must exist');
    // The seeded deadline is already past, so the pill may legitimately be in
    // its "due" state by the time we look; either wording comes from the host locale.
    assert.match(pill.__label.textContent, /后提醒起身|该起身了/, 'the pill must use the host locale');
    assert.equal(pill.getAttribute('aria-label'), pill.__label.textContent);

    const toast = await waitFor(() => root.findClass('dsr-toast'));
    assert.ok(toast, 'a due deadline must produce a toast');
    assert.equal(toast.__parts.text.textContent, '站起来走两步', 'the custom wording must be used');
    assert.equal(toast.__parts.badge.textContent, '起身时间到了');
    assert.equal(toast.__parts.group.textContent, '你的文案');
    assert.deepEqual(toast.__parts.actions.children.map(node => node.textContent), [
      '我起来了', '5 分钟后再说', '先不管',
    ]);

    // "I stood up" clears the toast and the daily counter is persisted.
    toast.__parts.actions.children[0].dispatch('click');
    assert.equal(root.findClass('dsr-toast'), null, 'standing up must dismiss the toast');
    const runtime = JSON.parse(env.stored.get('dsh-plugin-stand-reminder:v1:runtime'));
    assert.equal(runtime.standCount, 1);
    assert.ok(runtime.nextDueAt > stamp, 'the next deadline must move forward');
    assert.ok(env.stored.has('dsh-plugin-stand-reminder:v1:settings'), 'settings must be persisted');
  } finally {
    booted.stop();
  }
});
