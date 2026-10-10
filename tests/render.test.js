/**
 * Real-DOM render test.
 *
 * The bundle smoke test proves the Slot entries are registered; this proves the
 * settings page actually RENDERS. That distinction matters: a component that
 * throws on its first render leaves the panel blank while every registration
 * assertion still passes.
 *
 * It caught a real defect — the section was registered as `() => SettingsPage`,
 * so the shell used `SettingsPage` as the element type and called it with an
 * empty props object, leaving `engine`/`locale` undefined.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { JSDOM } from 'jsdom';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUNDLE = resolve(root, 'client/client.js');

/**
 * Boot the bundle inside a jsdom page and hand back the registered entries.
 * @param {{ language?: string }} [options]
 */
async function renderInPage({ language = 'zh-CN' } = {}) {
  const dom = new JSDOM(
    `<!doctype html><html lang="${language}"><head></head><body></body></html>`,
    { url: 'http://127.0.0.1:19387/', pretendToBeVisual: true },
  );
  const globals = {
    window: dom.window,
    document: dom.window.document,
    localStorage: dom.window.localStorage,
    CustomEvent: dom.window.CustomEvent,
    Notification: undefined,
    AudioContext: undefined,
  };
  const previous = new Map();
  for (const [key, value] of Object.entries(globals)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }

  const source = await readFile(BUNDLE, 'utf8');
  const requireShim = id => {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id === 'react-dom') return ReactDOM;
    if (id === '@deepseek-ai/dsh-client-ui-primitives') return {};
    throw new Error(`unexpected external module: ${id}`);
  };
  let captured = null;
  const fakeWindow = { __ModuleLoader__: { load: ({ id, factory }) => { captured = { id, exports: factory(requireShim) }; } } };
  new Function('window', source)(fakeWindow);
  assert.ok(captured, 'the bundle must register itself');

  /** The registered entries, keyed by slot name. */
  const registered = [];
  const snapshot = { active: language, locales: [], revision: 1 };
  captured.exports.apply({
    locale: {
      getLocale: () => snapshot,
      getSnapshot: () => snapshot,
      subscribe: () => () => {},
    },
    slots: {
      inject: (_key, callback) => callback() ?? (() => {}),
      register: (options, component) => { registered.push({ options, component }); return () => {}; },
    },
    effect: callback => { callback(); return () => {}; },
  });

  return {
    dom,
    document: dom.window.document,
    registered,
    find: name => registered.find(entry => entry.options.name === name),
    restore() {
      for (const [key, descriptor] of previous) {
        if (descriptor === undefined) delete globalThis[key];
        else Object.defineProperty(globalThis, key, descriptor);
      }
    },
  };
}

/** Mount an element and wait for effects to flush. */
async function mount(document, element, { settleMs = 120 } = {}) {
  const host = document.createElement('div');
  document.body.append(host);
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => { errors.push(args.map(String).join(' ')); };
  const root = createRoot(host);
  try {
    root.render(element);
    await new Promise(resolve => setTimeout(resolve, settleMs));
  } finally {
    console.error = originalError;
  }
  return { host, errors, unmount: () => root.unmount() };
}

test('the settings section renders a real page, not a blank panel', async () => {
  const page = await renderInPage();
  try {
    const section = page.find('settings.section');
    assert.ok(section, 'the settings section must be registered');
    const { host, errors } = await mount(page.document, React.createElement(section.component, { close() {} }));

    assert.deepEqual(errors, [], 'rendering must not log any React error');
    assert.ok(host.innerHTML.length > 2000, `the page should be full, got ${host.innerHTML.length} chars`);

    // Wording comes from the host locale, not a hardcoded default.
    const text = host.textContent;
    for (const expected of ['久坐提醒', '提醒节奏', '提醒文字', '我的提醒文字', '今日记录']) {
      assert.ok(text.includes(expected), `the rendered page is missing "${expected}"`);
    }
    // The controls the user needs must actually exist.
    assert.equal(host.querySelectorAll('input[type="checkbox"]').length, 5, 'five on/off switches');
    assert.equal(host.querySelectorAll('input[type="number"]').length, 2, 'interval and auto-dismiss fields');
    assert.equal(host.querySelectorAll('input[type="text"]').length, 1, 'the custom-message field');
    assert.ok(host.querySelector('.dsh-sr-preview-text').textContent.length > 5, 'the preview shows a message');
    assert.equal(host.querySelectorAll('.dsh-sr-switch input').length, 5);
    assert.ok(host.querySelectorAll('.dsh-sr-chip').length >= 8, 'interval presets and message modes');
  } finally {
    page.restore();
  }
});

test('the settings page follows an English host locale', async () => {
  const page = await renderInPage({ language: 'en-US' });
  try {
    const section = page.find('settings.section');
    const { host, errors } = await mount(page.document, React.createElement(section.component, {}));
    assert.deepEqual(errors, []);
    assert.ok(host.textContent.includes('Stand-up reminder'));
    assert.ok(host.textContent.includes('Rhythm'));
    assert.ok(!host.textContent.includes('久坐提醒'), 'no Chinese leaks into the English page');
  } finally {
    page.restore();
  }
});

test('the settings controls drive the engine and persist the change', async () => {
  const page = await renderInPage();
  try {
    const section = page.find('settings.section');
    const { host, errors, unmount } = await mount(page.document, React.createElement(section.component, {}));
    assert.deepEqual(errors, []);

    // Pick the 15-minute preset.
    const chip = [...host.querySelectorAll('.dsh-sr-chip')].find(node => node.textContent.trim() === '15 分钟');
    assert.ok(chip, 'the 15-minute preset must be rendered');
    chip.dispatchEvent(new page.dom.window.MouseEvent('click', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 60));

    const stored = JSON.parse(page.dom.window.localStorage.getItem('dsh-plugin-stand-reminder:v1:settings'));
    assert.equal(stored.intervalMinutes, 15, 'clicking a preset must persist through the engine');
    assert.equal(chip.dataset.active, 'true', 'the active preset must be marked');

    unmount();
  } finally {
    page.restore();
  }
});
