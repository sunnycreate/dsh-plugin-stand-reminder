/**
 * Settings schema, validation and persistence key.
 *
 * Pure module: no DOM, no timers, no Cordis. Everything here is directly
 * unit-testable under plain Node.
 */

export const STORAGE_PREFIX = 'dsh-plugin-stand-reminder:v1';

/** Storage keys owned by the plugin (one namespace, two records). */
export const STORAGE_KEYS = Object.freeze({
  settings: `${STORAGE_PREFIX}:settings`,
  runtime: `${STORAGE_PREFIX}:runtime`,
});

export const LIMITS = Object.freeze({
  // 20 minutes: long enough not to nag, short enough that the first reminder
  // arrives inside a normal work stretch.
  intervalMinutes: { min: 1, max: 480, default: 20 },
  dismissAfterSeconds: { min: 0, max: 600, default: 0 },
  snoozeMinutes: { min: 1, max: 60, default: 5 },
  customMessages: { maxCount: 50, maxLength: 200 },
});

/** @typedef {{
 *   enabled: boolean,
 *   intervalMinutes: number,
 *   messageMode: 'builtin' | 'custom' | 'mixed',
 *   customMessages: string[],
 *   notifySystem: boolean,
 *   sound: boolean,
 *   dismissAfterSeconds: number,
 *   snoozeMinutes: number,
 *   showStatus: boolean,
 *   keepAwake: boolean,
 * }} ReminderSettings
 */

/** @type {ReminderSettings} */
export const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  intervalMinutes: LIMITS.intervalMinutes.default,
  messageMode: 'mixed',
  customMessages: [],
  notifySystem: false,
  sound: true,
  dismissAfterSeconds: LIMITS.dismissAfterSeconds.default,
  snoozeMinutes: LIMITS.snoozeMinutes.default,
  showStatus: true,
  keepAwake: false,
});

const MESSAGE_MODES = new Set(['builtin', 'custom', 'mixed']);

function clampNumber(value, { min, max }, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

/**
 * Clean one custom message: single line, trimmed, bounded.
 * @returns {string} empty string when the input is not usable
 */
export function cleanMessage(value) {
  if (typeof value !== 'string') return '';
  const flattened = value.replace(/\s+/g, ' ').trim();
  return flattened.slice(0, LIMITS.customMessages.maxLength);
}

/**
 * Coerce arbitrary persisted/partial input into valid settings.
 * Unknown keys are dropped; every value is bounded.
 * @param {unknown} raw
 * @returns {ReminderSettings}
 */
export function normalizeSettings(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const seen = new Set();
  const customMessages = [];
  for (const entry of Array.isArray(source.customMessages) ? source.customMessages : []) {
    const message = cleanMessage(entry);
    if (!message || seen.has(message)) continue;
    seen.add(message);
    customMessages.push(message);
    if (customMessages.length >= LIMITS.customMessages.maxCount) break;
  }
  const mode = MESSAGE_MODES.has(source.messageMode) ? source.messageMode : DEFAULT_SETTINGS.messageMode;
  return {
    enabled: source.enabled !== false,
    intervalMinutes: clampNumber(source.intervalMinutes, LIMITS.intervalMinutes, DEFAULT_SETTINGS.intervalMinutes),
    // A custom-only pool with no custom text would leave nothing to say.
    messageMode: mode === 'custom' && customMessages.length === 0 ? 'mixed' : mode,
    customMessages,
    notifySystem: source.notifySystem === true,
    sound: source.sound !== false,
    dismissAfterSeconds: clampNumber(source.dismissAfterSeconds, LIMITS.dismissAfterSeconds, DEFAULT_SETTINGS.dismissAfterSeconds),
    snoozeMinutes: clampNumber(source.snoozeMinutes, LIMITS.snoozeMinutes, DEFAULT_SETTINGS.snoozeMinutes),
    showStatus: source.showStatus !== false,
    keepAwake: source.keepAwake === true,
  };
}

/** Settings objects are compared structurally to avoid pointless writes. */
export function settingsEqual(left, right) {
  return left.enabled === right.enabled
    && left.intervalMinutes === right.intervalMinutes
    && left.messageMode === right.messageMode
    && left.notifySystem === right.notifySystem
    && left.sound === right.sound
    && left.dismissAfterSeconds === right.dismissAfterSeconds
    && left.snoozeMinutes === right.snoozeMinutes
    && left.showStatus === right.showStatus
    && left.keepAwake === right.keepAwake
    && left.customMessages.length === right.customMessages.length
    && left.customMessages.every((message, index) => message === right.customMessages[index]);
}

/**
 * The message pool actually available under these settings.
 * @param {ReminderSettings} settings
 * @param {readonly {group: string, text: string}[]} builtIn
 * @returns {{group: string, text: string}[]}
 */
export function selectPool(settings, builtIn) {
  const custom = settings.customMessages.map(text => ({ group: 'custom', text }));
  if (settings.messageMode === 'custom') return custom.length > 0 ? custom : builtIn.map(message => ({ ...message }));
  if (settings.messageMode === 'builtin') return builtIn.map(message => ({ ...message }));
  return [...builtIn.map(message => ({ ...message })), ...custom];
}

/** Runtime state that survives a reload (but resets at local midnight). */
export const DEFAULT_RUNTIME = Object.freeze({
  lastStandAt: /** @type {number|null} */ (null),
  nextDueAt: /** @type {number|null} */ (null),
  paused: false,
  todayKey: '',
  standCount: 0,
  snoozeCount: 0,
});

export function normalizeRuntime(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const finite = value => (typeof value === 'number' && Number.isFinite(value) ? value : null);
  return {
    lastStandAt: finite(source.lastStandAt),
    nextDueAt: finite(source.nextDueAt),
    paused: source.paused === true,
    todayKey: typeof source.todayKey === 'string' ? source.todayKey.slice(0, 16) : '',
    standCount: Math.max(0, Math.min(9999, clampNumber(source.standCount, { min: 0, max: 9999 }, 0))),
    snoozeCount: Math.max(0, Math.min(9999, clampNumber(source.snoozeCount, { min: 0, max: 9999 }, 0))),
  };
}

/** Local calendar day key, used to roll the daily counter over. */
export function dayKey(now) {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
