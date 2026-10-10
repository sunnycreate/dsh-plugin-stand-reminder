import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ReminderEngine } from '../src/core/engine.js';
import { DEFAULT_MESSAGES, builtInMessages, messageLanguage } from '../src/core/messages.js';
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  cleanMessage,
  dayKey,
  normalizeSettings,
  selectPool,
  settingsEqual,
} from '../src/core/settings.js';

const MINUTE = 60000;

/** In-memory storage adapter plus an injectable clock. */
function harness({ settings, runtime, language = 'zh', tickMs } = {}) {
  const store = new Map();
  if (settings) store.set(STORAGE_KEYS.settings, JSON.stringify(settings));
  if (runtime) store.set(STORAGE_KEYS.runtime, JSON.stringify(runtime));
  let now = Date.parse('2026-03-02T09:00:00');
  const events = [];
  const engine = new ReminderEngine({
    storage: {
      get: key => (store.has(key) ? store.get(key) : null),
      set: (key, value) => { store.set(key, value); },
    },
    language,
    now: () => now,
    tickMs: tickMs ?? 1000,
    onEvent: (kind, payload) => events.push({ kind, payload }),
  });
  return {
    engine,
    events,
    store,
    get now() { return now; },
    set now(value) { now = value; },
    advance(ms) { now += ms; },
    stored(key) { return store.has(key) ? JSON.parse(store.get(key)) : null; },
  };
}

test('a fresh engine starts a full interval ahead and does not fire on load', () => {
  const h = harness();
  assert.equal(h.engine.settings.intervalMinutes, DEFAULT_SETTINGS.intervalMinutes);
  assert.equal(h.engine.snapshot().remainingMs, DEFAULT_SETTINGS.intervalMinutes * MINUTE);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
});

test('a persisted deadline that already passed fires on the first tick', () => {
  const startedAt = Date.parse('2026-03-02T09:00:00');
  const h = harness({ runtime: { lastStandAt: startedAt, nextDueAt: startedAt - MINUTE, todayKey: dayKey(startedAt) } });
  h.engine.tick();
  const notice = h.engine.snapshot().notice;
  assert.ok(notice, 'a missed deadline must still remind');
  assert.equal(notice.test, false);
  assert.equal(h.events.filter(event => event.kind === 'reminder').length, 1);
});

test('the reminder fires exactly at the interval and re-arms one interval later', () => {
  const h = harness({ settings: { intervalMinutes: 30 } });
  const start = h.now;
  h.advance(30 * MINUTE - 1000);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null, 'not a second early');
  h.advance(1000);
  h.engine.tick();
  assert.ok(h.engine.snapshot().notice);
  assert.equal(h.engine.snapshot().nextDueAt, start + 60 * MINUTE);
});

test('dismissing a notice does not re-fire it on the next tick', () => {
  const h = harness({ settings: { intervalMinutes: 1 } });
  h.advance(MINUTE);
  h.engine.tick();
  assert.ok(h.engine.snapshot().notice);
  h.engine.dismiss();
  h.engine.tick();
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
  assert.equal(h.events.filter(event => event.kind === 'reminder').length, 1);
});

test('standing up counts once and restarts the interval from now', () => {
  const h = harness({ settings: { intervalMinutes: 20 } });
  h.advance(20 * MINUTE);
  h.engine.tick();
  const stoodAt = h.now;
  h.engine.standUp();
  const snapshot = h.engine.snapshot();
  assert.equal(snapshot.standCount, 1);
  assert.equal(snapshot.notice, null);
  assert.equal(snapshot.nextDueAt, stoodAt + 20 * MINUTE);
});

test('snoozing pushes the deadline back without counting as a stand-up', () => {
  const h = harness({ settings: { intervalMinutes: 30, snoozeMinutes: 5 } });
  h.advance(30 * MINUTE);
  h.engine.tick();
  h.engine.snooze();
  const snapshot = h.engine.snapshot();
  assert.equal(snapshot.standCount, 0);
  assert.equal(snapshot.snoozeCount, 1);
  assert.equal(snapshot.notice, null);
  assert.equal(snapshot.nextDueAt, h.now + 5 * MINUTE);
  // The snooze delay is honoured, not the interval.
  h.advance(5 * MINUTE);
  h.engine.tick();
  assert.ok(h.engine.snapshot().notice);
});

test('pausing stops reminders and resuming restarts the countdown', () => {
  const h = harness({ settings: { intervalMinutes: 10 } });
  h.engine.setPaused(true);
  h.advance(60 * MINUTE);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
  assert.equal(h.engine.snapshot().paused, true);
  const resumedAt = h.now;
  h.engine.setPaused(false);
  assert.equal(h.engine.snapshot().nextDueAt, resumedAt + 10 * MINUTE);
});

test('disabling the reminder stops it without losing the settings', () => {
  const h = harness({ settings: { intervalMinutes: 5, sound: false } });
  h.engine.patchSettings({ enabled: false });
  h.advance(60 * MINUTE);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
  assert.equal(h.stored(STORAGE_KEYS.settings).sound, false, 'other preferences survive');
  assert.equal(h.stored(STORAGE_KEYS.settings).enabled, false);
});

test('changing the interval immediately re-arms the countdown', () => {
  const h = harness({ settings: { intervalMinutes: 60 } });
  h.advance(10 * MINUTE);
  h.engine.patchSettings({ intervalMinutes: 15 });
  assert.equal(h.engine.snapshot().nextDueAt, h.now + 15 * MINUTE);
});

test('the daily counter rolls over at the local date boundary', () => {
  const h = harness({ settings: { intervalMinutes: 1 } });
  h.engine.standUp();
  h.engine.standUp();
  assert.equal(h.engine.snapshot().standCount, 2);
  const nextDay = Date.parse('2026-03-03T00:00:30');
  h.now = nextDay;
  h.engine.tick();
  assert.equal(h.engine.snapshot().standCount, 0);
  assert.equal(h.stored(STORAGE_KEYS.runtime).todayKey, dayKey(nextDay));
});

test('an auto-dismissing notice clears itself and does not immediately re-fire', () => {
  const h = harness({ settings: { intervalMinutes: 30, dismissAfterSeconds: 20 } });
  h.advance(30 * MINUTE);
  h.engine.tick();
  assert.ok(h.engine.snapshot().notice);
  h.advance(19 * 1000);
  h.engine.tick();
  assert.ok(h.engine.snapshot().notice, 'still visible just before the timeout');
  h.advance(2 * 1000);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
  h.engine.tick();
  assert.equal(h.engine.snapshot().notice, null);
});

test('the test button fires the current pool without touching the schedule', () => {
  const h = harness({ settings: { intervalMinutes: 45, messageMode: 'custom', customMessages: ['站起来走两步'] } });
  const dueBefore = h.engine.snapshot().nextDueAt;
  h.engine.testReminder();
  const notice = h.engine.snapshot().notice;
  assert.equal(notice.text, '站起来走两步');
  assert.equal(notice.test, true);
  assert.equal(h.engine.snapshot().nextDueAt, dueBefore);
});

test('message selection follows the chosen mode', () => {
  const h = harness({ settings: { messageMode: 'custom', customMessages: ['第一条', '第二条'] } });
  const pool = selectPool(h.engine.settings, builtInMessages('zh'));
  assert.deepEqual(pool.map(message => message.text), ['第一条', '第二条']);
  assert.deepEqual(pool.map(message => message.group), ['custom', 'custom']);

  h.engine.patchSettings({ messageMode: 'builtin' });
  assert.equal(h.engine.snapshot().poolSize, DEFAULT_MESSAGES.zh.length);

  h.engine.patchSettings({ messageMode: 'mixed' });
  assert.equal(h.engine.snapshot().poolSize, DEFAULT_MESSAGES.zh.length + 2);
});

test('a notice never repeats the immediately preceding wording', () => {
  const messages = ['甲', '乙', '丙'];
  const seen = new Set();
  const h = harness({ settings: { intervalMinutes: 1, messageMode: 'custom', customMessages: messages } });
  for (let round = 0; round < 12; round += 1) {
    h.advance(MINUTE);
    h.engine.tick();
    const notice = h.engine.snapshot().notice;
    assert.ok(messages.includes(notice.text));
    seen.add(notice.text);
    h.engine.standUp();
  }
  assert.equal(seen.size, messages.length, 'every custom message gets a turn');
});

test('the built-in pool is language aware and substantive in both languages', () => {
  assert.equal(messageLanguage('zh-CN'), 'zh');
  assert.equal(messageLanguage('en-US'), 'en');
  assert.equal(messageLanguage(undefined), 'en');
  for (const language of ['zh', 'en']) {
    const pool = builtInMessages(language);
    assert.ok(pool.length >= 18, `${language} pool should be a real rotation`);
    assert.ok(pool.every(message => message.text.length >= 12));
    assert.ok(pool.every(message => ['move', 'eyes', 'posture', 'habit'].includes(message.group)));
    const unique = new Set(pool.map(message => message.text));
    assert.equal(unique.size, pool.length, 'no duplicated wording');
    assert.ok(pool.some(message => /起|stand|mov|站起来|走动/i.test(message.text)));
  }
  assert.equal(builtInMessages('zh').length, DEFAULT_MESSAGES.zh.length);
});

test('settings normalization bounds every field and drops junk', () => {
  const normalized = normalizeSettings({
    enabled: 'yes',
    intervalMinutes: 9999,
    messageMode: 'nonsense',
    customMessages: ['  多余   空格  ', '', '  多余   空格  ', 42, 'x'.repeat(500)],
    dismissAfterSeconds: -5,
    snoozeMinutes: 10000,
    unknownKey: true,
  });
  assert.equal(normalized.enabled, true, 'only an explicit false disables');
  assert.equal(normalized.intervalMinutes, 480);
  assert.equal(normalized.messageMode, 'mixed');
  assert.equal(normalized.customMessages.length, 2, 'blank and duplicate entries are dropped');
  assert.equal(normalized.customMessages[0], '多余 空格');
  assert.equal(normalized.customMessages[1].length, 200);
  assert.equal(normalized.dismissAfterSeconds, 0);
  assert.equal(normalized.snoozeMinutes, 60);
  assert.ok(!('unknownKey' in normalized));
});

test('a custom-only mode with no custom text falls back to the built-in pool', () => {
  const normalized = normalizeSettings({ messageMode: 'custom', customMessages: [] });
  assert.equal(normalized.messageMode, 'mixed');
});

test('settings equality is structural, so writes only happen on real change', () => {
  const base = normalizeSettings({ customMessages: ['a', 'b'] });
  assert.ok(settingsEqual(base, normalizeSettings({ customMessages: ['a', 'b'] })));
  assert.ok(!settingsEqual(base, normalizeSettings({ customMessages: ['a', 'b', 'c'] })));
  assert.ok(!settingsEqual(base, normalizeSettings({ customMessages: ['a', 'c'] })));
  assert.ok(!settingsEqual(base, normalizeSettings({ keepAwake: true })), 'every toggle participates in equality');
  assert.ok(!settingsEqual(base, normalizeSettings({ snoozeMinutes: 9 })));
});

test('the optional behaviour toggles persist their own values', () => {
  const h = harness();
  assert.equal(h.engine.settings.keepAwake, false, 'screen wake lock is opt-in');
  assert.equal(h.engine.settings.notifySystem, false, 'system notifications are opt-in');
  h.engine.patchSettings({ keepAwake: true, notifySystem: true, sound: false, snoozeMinutes: 12 });
  const stored = h.stored(STORAGE_KEYS.settings);
  assert.deepEqual(
    { keepAwake: stored.keepAwake, notifySystem: stored.notifySystem, sound: stored.sound, snoozeMinutes: stored.snoozeMinutes },
    { keepAwake: true, notifySystem: true, sound: false, snoozeMinutes: 12 },
  );
});

test('cleanMessage flattens whitespace and refuses non-strings', () => {
  assert.equal(cleanMessage('  a\n\tb  '), 'a b');
  assert.equal(cleanMessage(undefined), '');
  assert.equal(cleanMessage({ text: 'x' }), '');
});

test('corrupt persisted state is ignored rather than thrown', () => {
  const store = new Map([[STORAGE_KEYS.settings, '{not json'], [STORAGE_KEYS.runtime, 'null']]);
  const engine = new ReminderEngine({
    storage: { get: key => store.get(key) ?? null, set: (key, value) => store.set(key, value) },
    language: 'en',
    now: () => Date.parse('2026-03-02T09:00:00'),
  });
  assert.equal(engine.settings.intervalMinutes, DEFAULT_SETTINGS.intervalMinutes);
  assert.equal(engine.snapshot().remainingMs, DEFAULT_SETTINGS.intervalMinutes * MINUTE);
});

test('a storage that always throws still runs the reminder', () => {
  const engine = new ReminderEngine({
    storage: {
      get() { throw new Error('denied'); },
      set() { throw new Error('denied'); },
    },
    language: 'zh',
    now: () => Date.parse('2026-03-02T09:00:00'),
  });
  engine.standUp();
  assert.equal(engine.snapshot().standCount, 1);
  engine.patchSettings({ intervalMinutes: 5 });
  assert.equal(engine.settings.intervalMinutes, 5);
});

test('dispose stops the timer and detaches subscribers', () => {
  const h = harness({ settings: { intervalMinutes: 1 }, tickMs: 5 });
  let calls = 0;
  const unsubscribe = h.engine.subscribe(() => { calls += 1; });
  h.engine.start();
  h.engine.dispose();
  h.engine.tick();
  unsubscribe();
  assert.equal(h.engine.timer, null);
  assert.equal(calls, 0);
});
