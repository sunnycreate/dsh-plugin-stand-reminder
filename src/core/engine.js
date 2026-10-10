/**
 * The reminder engine: scheduling, snoozing and daily progress.
 *
 * Deliberately framework-free. All time is injected (`now`) and all persistence
 * goes through an injected storage adapter, so the whole scheduler is unit
 * tested under plain Node without a browser.
 */
import { builtInMessages } from './messages.js';
import {
  DEFAULT_RUNTIME,
  DEFAULT_SETTINGS,
  LIMITS,
  STORAGE_KEYS,
  dayKey,
  normalizeRuntime,
  normalizeSettings,
  selectPool,
  settingsEqual,
} from './settings.js';

const TICK_MS = 1000;

/**
 * @typedef {object} StorageAdapter
 * @property {(key: string) => string | null} get
 * @property {(key: string, value: string) => void} set
 */

/**
 * @typedef {object} EngineOptions
 * @property {StorageAdapter} storage
 * @property {string} [language] BCP-47-ish tag used to pick the built-in pool
 * @property {() => number} [now]
 * @property {(kind: 'reminder'|'change', payload?: unknown) => void} [onEvent]
 * @property {number} [tickMs]
 */

/** A notice keeps its wording for its whole life so a re-render cannot swap it. */
function makeNotice(settings, language, previousText) {
  const pool = selectPool(settings, builtInMessages(language));
  if (pool.length === 0) return { text: '', group: 'custom' };
  if (pool.length === 1) return { text: pool[0].text, group: pool[0].group };
  let pick = pool[0];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick.text !== previousText) break;
  }
  return { text: pick.text, group: pick.group };
}

export class ReminderEngine {
  /** @param {EngineOptions} options */
  constructor({ storage, language = 'zh', now = () => Date.now(), onEvent, tickMs = TICK_MS }) {
    this.storage = storage;
    this.language = language;
    this.now = now;
    this.onEvent = typeof onEvent === 'function' ? onEvent : () => {};
    this.tickMs = tickMs;
    this.settings = this.#read(STORAGE_KEYS.settings, DEFAULT_SETTINGS, normalizeSettings);
    this.runtime = this.#read(STORAGE_KEYS.runtime, DEFAULT_RUNTIME, normalizeRuntime);
    this.notice = null;
    this.timer = null;
    this.disposed = false;
    this.listeners = new Set();
    this.rollover(this.now());
    // A reloaded page must not fire the moment it opens: assume the user just
    // had a chance to move. Only a *due* deadline from this session counts.
    if (this.runtime.nextDueAt === null || this.runtime.lastStandAt === null) {
      this.runtime.lastStandAt = this.now();
      this.runtime.nextDueAt = this.runtime.lastStandAt + this.settings.intervalMinutes * 60000;
      this.#persistRuntime();
    }
  }

  #read(key, fallback, normalize) {
    try {
      const raw = this.storage?.get?.(key);
      if (raw === null || raw === undefined) return { ...fallback };
      return normalize(JSON.parse(raw));
    } catch {
      return { ...fallback };
    }
  }

  #persistSettings() {
    try {
      this.storage?.set?.(STORAGE_KEYS.settings, JSON.stringify(this.settings));
    } catch { /* a denied storage keeps the live value for this page */ }
  }

  #persistRuntime() {
    try {
      this.storage?.set?.(STORAGE_KEYS.runtime, JSON.stringify(this.runtime));
    } catch { /* a denied storage keeps the live value for this page */ }
  }

  // -- lifecycle ------------------------------------------------------------

  start() {
    if (this.disposed || this.timer !== null) return;
    this.timer = setInterval(() => this.tick(), this.tickMs);
    // Node keeps a bare interval alive; browsers have no unref. This only
    // affects embedding the engine outside a page (tests, tooling).
    this.timer?.unref?.();
    // A tab that was backgrounded may have blown well past its deadline; the
    // first visible tick decides what to do with it.
    this.tick();
  }

  dispose() {
    this.disposed = true;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.listeners.clear();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  #emit(kind = 'change', payload) {
    for (const listener of [...this.listeners]) {
      try { listener(this.snapshot()); } catch { /* a bad listener must not stop the clock */ }
    }
    try { this.onEvent(kind, payload); } catch { /* UI callbacks cannot poison the engine */ }
  }

  // -- scheduling -----------------------------------------------------------

  /** Roll the daily counter over when the local date changes. */
  rollover(now = this.now()) {
    const key = dayKey(now);
    if (this.runtime.todayKey === key) return false;
    this.runtime.todayKey = key;
    this.runtime.standCount = 0;
    this.runtime.snoozeCount = 0;
    this.#persistRuntime();
    return true;
  }

  /** Reschedule the next deadline from `now`, using the configured interval. */
  #scheduleNext(now) {
    this.runtime.nextDueAt = now + this.settings.intervalMinutes * 60000;
    this.#persistRuntime();
  }

  tick(now = this.now()) {
    if (this.disposed) return;
    this.rollover(now);
    // Expire a notice that asked to disappear on its own.
    if (this.notice !== null && this.notice.expiresAt !== null && now >= this.notice.expiresAt) {
      this.notice = null;
      this.#emit('change');
    }
    if (this.notice !== null) return;
    if (!this.settings.enabled || this.runtime.paused) return;
    const due = this.runtime.nextDueAt;
    if (due === null || now < due) return;
    this.#fire(now);
  }

  #fire(now) {
    const notice = makeNotice(this.settings, this.language, this.notice?.text);
    const expiresAt = this.settings.dismissAfterSeconds > 0
      ? now + this.settings.dismissAfterSeconds * 1000
      : null;
    this.notice = { ...notice, shownAt: now, expiresAt, test: false };
    // The deadline is pushed one full interval further, so a dismissed notice
    // never re-fires the moment it is cleared.
    this.runtime.nextDueAt = now + this.settings.intervalMinutes * 60000;
    this.#persistRuntime();
    const payload = { text: this.notice.text, group: this.notice.group, test: false };
    this.#emit('reminder', payload);
  }

  // -- user actions ---------------------------------------------------------

  /** "I got up" — clears the notice and restarts the interval from now. */
  standUp(now = this.now()) {
    this.rollover(now);
    this.notice = null;
    this.runtime.standCount += 1;
    this.runtime.lastStandAt = now;
    this.#scheduleNext(now);
    this.#emit('change');
    return this.snapshot();
  }

  snooze(minutes = LIMITS.snoozeMinutes.default, now = this.now()) {
    const delay = Math.min(
      LIMITS.snoozeMinutes.max,
      Math.max(LIMITS.snoozeMinutes.min, Math.round(Number(minutes) || LIMITS.snoozeMinutes.default)),
    );
    this.notice = null;
    this.runtime.nextDueAt = now + delay * 60000;
    this.runtime.snoozeCount += 1;
    this.#persistRuntime();
    this.#emit('change');
    return this.snapshot();
  }

  dismiss() {
    this.notice = null;
    this.#emit('change');
    return this.snapshot();
  }

  setPaused(paused, now = this.now()) {
    this.runtime.paused = paused === true;
    this.notice = this.runtime.paused ? null : this.notice;
    if (!this.runtime.paused) this.#scheduleNext(now);
    this.#persistRuntime();
    this.#emit('change');
    return this.snapshot();
  }

  setEnabled(enabled, now = this.now()) {
    this.patchSettings({ enabled: enabled === true }, now);
  }

  /** Fire a notice immediately, ignoring the interval (the settings "try it" button). */
  testReminder(now = this.now()) {
    const notice = makeNotice(this.settings, this.language, this.notice?.text);
    this.notice = { ...notice, shownAt: now, expiresAt: null, test: true };
    const payload = { text: notice.text, group: notice.group, test: true };
    this.#emit('reminder', payload);
    return this.snapshot();
  }

  resetProgress(now = this.now()) {
    this.rollover(now);
    this.runtime.standCount = 0;
    this.runtime.snoozeCount = 0;
    this.notice = null;
    this.runtime.lastStandAt = now;
    this.#scheduleNext(now);
    this.#emit('change');
    return this.snapshot();
  }

  patchSettings(patch, now = this.now()) {
    const next = normalizeSettings({ ...this.settings, ...(patch && typeof patch === 'object' ? patch : {}) });
    if (settingsEqual(next, this.settings)) return this.settings;
    const intervalChanged = next.intervalMinutes !== this.settings.intervalMinutes;
    const wasEnabled = this.settings.enabled;
    this.settings = next;
    this.#persistSettings();
    if (!next.enabled) {
      this.notice = null;
    } else if (!wasEnabled || intervalChanged) {
      // Restart the countdown so a fresh interval is honoured immediately.
      this.runtime.lastStandAt = now;
      this.notice = null;
      this.#scheduleNext(now);
    }
    this.#emit('change');
    return this.settings;
  }

  setLanguage(language) {
    if (language === this.language) return;
    this.language = language;
    this.#emit('change');
  }

  // -- projections ----------------------------------------------------------

  /** @returns {{group: string, text: string}} */
  messagePreview() {
    return makeNotice(this.settings, this.language, null);
  }

  availablePoolSize() {
    return selectPool(this.settings, builtInMessages(this.language)).length;
  }

  snapshot(now = this.now()) {
    const notice = this.notice;
    return {
      settings: this.settings,
      paused: this.runtime.paused,
      standCount: this.runtime.standCount,
      snoozeCount: this.runtime.snoozeCount,
      nextDueAt: this.runtime.nextDueAt,
      lastStandAt: this.runtime.lastStandAt,
      remainingMs: this.runtime.nextDueAt === null ? null : Math.max(0, this.runtime.nextDueAt - now),
      due: this.runtime.nextDueAt !== null && now >= this.runtime.nextDueAt,
      notice: notice === null ? null : {
        text: notice.text,
        group: notice.group,
        test: notice.test === true,
        shownAt: notice.shownAt,
        expiresAt: notice.expiresAt,
      },
      poolSize: this.availablePoolSize(),
    };
  }
}
