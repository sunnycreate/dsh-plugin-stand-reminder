window.__ModuleLoader__.load({ id: "dsh-plugin-stand-reminder", factory: (require) => {
var __dshStandReminderModule = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name2 in all)
      __defProp(target, name2, { get: all[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/client/index.jsx
  var index_exports = {};
  __export(index_exports, {
    apply: () => apply,
    inject: () => inject,
    name: () => name
  });
  var import_react2 = __toESM(__require("react"), 1);

  // src/core/messages.js
  var GROUP_ORDER = Object.freeze(["move", "eyes", "posture", "habit"]);
  var DEFAULT_MESSAGES = Object.freeze({
    zh: Object.freeze([
      // 走动 / 活动 — 直接给出可执行的动作
      Object.freeze({ group: "move", text: "\u5750\u6EE1\u4E00\u6BB5\u65F6\u95F4\u4E86\uFF0C\u7AD9\u8D77\u6765\u8D70\u4E24\u6B65\u5427\uFF0C\u54EA\u6015\u53EA\u5230\u7A97\u8FB9\u6253\u4E2A\u8F6C\u3002" }),
      Object.freeze({ group: "move", text: "\u8D77\u6765\u52A8\u4E00\u52A8\uFF1A\u63A5\u676F\u6C34\uFF0C\u987A\u4FBF\u628A\u80A9\u548C\u8116\u5B50\u8F6C\u4E00\u5708\u3002" }),
      Object.freeze({ group: "move", text: "\u522B\u770B\u5C4F\u5E55\u4E86\uFF0C\u5148\u7AD9\u8D77\u6765\u3002\u8D70\u5230\u6700\u8FDC\u7684\u90A3\u4E2A\u89D2\u843D\u518D\u56DE\u6765\u3002" }),
      Object.freeze({ group: "move", text: "\u7ED9\u8EAB\u4F53\u4E24\u5206\u949F\uFF1A\u4F38\u4E2A\u61D2\u8170\uFF0C\u6D3B\u52A8\u4E00\u4E0B\u811A\u8E1D\u548C\u819D\u76D6\u3002" }),
      Object.freeze({ group: "move", text: "\u7AD9\u8D77\u6765\uFF0C\u53CC\u624B\u4E3E\u8FC7\u5934\u9876\u4F38\u5C55\u4E09\u6B21\uFF0C\u7136\u540E\u6162\u6162\u653E\u4E0B\u3002" }),
      Object.freeze({ group: "move", text: "\u8BE5\u6362\u4E2A\u59FF\u52BF\u4E86\u3002\u8D77\u8EAB\u8D70\u4E09\u5341\u6B65\uFF0C\u8BA9\u8840\u6DB2\u8DD1\u4E00\u5708\u3002" }),
      Object.freeze({ group: "move", text: "\u4E45\u5750\u63D0\u9192\uFF1A\u73B0\u5728\u7AD9\u8D77\u6765\uFF0C\u8D70\u4E00\u8D70\uFF0C\u4E24\u5206\u949F\u540E\u518D\u56DE\u6765\u3002" }),
      Object.freeze({ group: "move", text: "\u628A\u6905\u5B50\u63A8\u8FDC\u4E00\u70B9\uFF0C\u7AD9\u8D77\u6765\u3002\u4F60\u9700\u8981\u7684\u662F\u8D70\u52A8\uFF0C\u4E0D\u662F\u6362\u4E2A\u5750\u59FF\u3002" }),
      // 眼睛 — 20-20-20 法则
      Object.freeze({ group: "eyes", text: "\u8BA9\u773C\u775B\u4E0B\u73ED\u4E8C\u5341\u79D2\uFF0C\u770B\u770B\u516D\u7C73\u5916\u7684\u4E1C\u897F\u3002" }),
      Object.freeze({ group: "eyes", text: "\u7AD9\u8D77\u6765\uFF0C\u671B\u5411\u7A97\u5916\u6700\u8FDC\u7684\u5730\u65B9\uFF0C\u6162\u6162\u7728\u773C\u51E0\u6B21\u3002" }),
      Object.freeze({ group: "eyes", text: "\u773C\u775B\u4E5F\u9700\u8981\u6D3B\u52A8\uFF1A\u8FDC\u773A\u4E8C\u5341\u79D2\uFF0C\u518D\u56DE\u6765\u7EE7\u7EED\u3002" }),
      // 体态 — 局部放松
      Object.freeze({ group: "posture", text: "\u80A9\u8180\u662F\u4E0D\u662F\u53C8\u8038\u8D77\u6765\u4E86\uFF1F\u7AD9\u8D77\u6765\u653E\u677E\uFF0C\u518D\u5750\u56DE\u53BB\u3002" }),
      Object.freeze({ group: "posture", text: "\u4E0B\u5DF4\u6536\u4E00\u70B9\uFF0C\u80A9\u5F80\u540E\u6253\u5F00\uFF0C\u7136\u540E\u7AD9\u8D77\u6765\u6D3B\u52A8\u4E00\u4E0B\u8170\u3002" }),
      Object.freeze({ group: "posture", text: "\u624B\u8155\u8F6C\u4E00\u8F6C\uFF0C\u624B\u6307\u5F20\u5F00\u518D\u63E1\u7D27\uFF0C\u7136\u540E\u8D77\u8EAB\u8D70\u8D70\u3002" }),
      Object.freeze({ group: "posture", text: "\u8170\u80CC\u6709\u6CA1\u6709\u53D1\u7D27\uFF1F\u7AD9\u8D77\u6765\u540E\u4EF0\u4F38\u5C55\u4E00\u4E0B\u518D\u56DE\u6765\u3002" }),
      // 习惯 — 轻推一把
      Object.freeze({ group: "habit", text: "\u6CE8\u610F\u5750\u59FF\uFF1A\u522B\u8DF7\u817F\uFF0C\u53CC\u811A\u653E\u5E73\u3002\u518D\u7AD9\u8D77\u6765\u52A8\u4E00\u52A8\u3002" }),
      Object.freeze({ group: "habit", text: "\u79BB\u5C4F\u5E55\u8FDC\u4E00\u70B9\uFF0C\u7AD9\u8D77\u6765\u52A8\u4E00\u52A8\uFF0C\u4F60\u4F1A\u66F4\u6E05\u9192\u3002" }),
      Object.freeze({ group: "habit", text: "\u8FD9\u4E00\u8F6E\u7684\u4E45\u5750\u5230\u6B64\u4E3A\u6B62\uFF0C\u7AD9\u8D77\u6765\u7ED9\u8EAB\u4F53\u4E00\u70B9\u65F6\u95F4\u3002" }),
      Object.freeze({ group: "habit", text: "\u8D77\u6765\u5427\uFF0C\u5C31\u5F53\u662F\u5E2E\u4E0B\u4E00\u6BB5\u5DE5\u4F5C\u6512\u4E00\u70B9\u4E13\u6CE8\u529B\u3002" })
    ]),
    en: Object.freeze([
      Object.freeze({ group: "move", text: "You have been sitting a while \u2014 stand up and take a few steps, even just to the window." }),
      Object.freeze({ group: "move", text: "Time to move: grab some water and roll your shoulders and neck on the way." }),
      Object.freeze({ group: "move", text: "Look away from the screen and stand up. Walk to the far corner and back." }),
      Object.freeze({ group: "move", text: "Give your body two minutes: stretch, then circle your ankles and knees." }),
      Object.freeze({ group: "move", text: "Stand up, reach both hands overhead three times, then lower them slowly." }),
      Object.freeze({ group: "move", text: "Change position. Take thirty steps and get the blood moving." }),
      Object.freeze({ group: "move", text: "Sitting reminder: stand up and walk for two minutes, then come back." }),
      Object.freeze({ group: "move", text: "Push the chair back and stand. You need to walk, not just shift position." }),
      Object.freeze({ group: "eyes", text: "Give your eyes twenty seconds off \u2014 look at something twenty feet away." }),
      Object.freeze({ group: "eyes", text: "Stand up and look at the furthest thing outside. Blink slowly a few times." }),
      Object.freeze({ group: "eyes", text: "Your eyes need a break too: gaze into the distance for twenty seconds." }),
      Object.freeze({ group: "posture", text: "Shoulders creeping up again? Stand, let them drop, then sit back down." }),
      Object.freeze({ group: "posture", text: "Chin in, shoulders back \u2014 then stand up and loosen your lower back." }),
      Object.freeze({ group: "posture", text: "Roll your wrists, spread and close your fingers, then get up and walk." }),
      Object.freeze({ group: "posture", text: "Is your back tightening? Stand up, lean back and stretch before returning." }),
      Object.freeze({ group: "habit", text: "Check your posture: no crossed legs, feet flat. Then stand and move." }),
      Object.freeze({ group: "habit", text: "Move back from the screen, stand up and walk \u2014 you will think more clearly." }),
      Object.freeze({ group: "habit", text: "That is enough sitting for this stretch. Stand up and give your body a moment." }),
      Object.freeze({ group: "habit", text: "Get up \u2014 think of it as banking focus for the next round of work." })
    ])
  });
  function messageLanguage(language) {
    return typeof language === "string" && /^zh(?:$|[-_])/i.test(language.trim()) ? "zh" : "en";
  }
  function builtInMessages(language) {
    return DEFAULT_MESSAGES[messageLanguage(language)].map((message) => ({ ...message }));
  }

  // src/core/settings.js
  var STORAGE_PREFIX = "dsh-plugin-stand-reminder:v1";
  var STORAGE_KEYS = Object.freeze({
    settings: `${STORAGE_PREFIX}:settings`,
    runtime: `${STORAGE_PREFIX}:runtime`
  });
  var LIMITS = Object.freeze({
    // 20 minutes: long enough not to nag, short enough that the first reminder
    // arrives inside a normal work stretch.
    intervalMinutes: { min: 1, max: 480, default: 20 },
    dismissAfterSeconds: { min: 0, max: 600, default: 0 },
    snoozeMinutes: { min: 1, max: 60, default: 5 },
    customMessages: { maxCount: 50, maxLength: 200 }
  });
  var DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    intervalMinutes: LIMITS.intervalMinutes.default,
    messageMode: "mixed",
    customMessages: [],
    notifySystem: false,
    sound: true,
    dismissAfterSeconds: LIMITS.dismissAfterSeconds.default,
    snoozeMinutes: LIMITS.snoozeMinutes.default,
    showStatus: true,
    keepAwake: false
  });
  var MESSAGE_MODES = /* @__PURE__ */ new Set(["builtin", "custom", "mixed"]);
  function clampNumber(value, { min, max }, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  }
  function cleanMessage(value) {
    if (typeof value !== "string") return "";
    const flattened = value.replace(/\s+/g, " ").trim();
    return flattened.slice(0, LIMITS.customMessages.maxLength);
  }
  function normalizeSettings(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const seen = /* @__PURE__ */ new Set();
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
      messageMode: mode === "custom" && customMessages.length === 0 ? "mixed" : mode,
      customMessages,
      notifySystem: source.notifySystem === true,
      sound: source.sound !== false,
      dismissAfterSeconds: clampNumber(source.dismissAfterSeconds, LIMITS.dismissAfterSeconds, DEFAULT_SETTINGS.dismissAfterSeconds),
      snoozeMinutes: clampNumber(source.snoozeMinutes, LIMITS.snoozeMinutes, DEFAULT_SETTINGS.snoozeMinutes),
      showStatus: source.showStatus !== false,
      keepAwake: source.keepAwake === true
    };
  }
  function settingsEqual(left, right) {
    return left.enabled === right.enabled && left.intervalMinutes === right.intervalMinutes && left.messageMode === right.messageMode && left.notifySystem === right.notifySystem && left.sound === right.sound && left.dismissAfterSeconds === right.dismissAfterSeconds && left.snoozeMinutes === right.snoozeMinutes && left.showStatus === right.showStatus && left.keepAwake === right.keepAwake && left.customMessages.length === right.customMessages.length && left.customMessages.every((message, index) => message === right.customMessages[index]);
  }
  function selectPool(settings, builtIn) {
    const custom = settings.customMessages.map((text) => ({ group: "custom", text }));
    if (settings.messageMode === "custom") return custom.length > 0 ? custom : builtIn.map((message) => ({ ...message }));
    if (settings.messageMode === "builtin") return builtIn.map((message) => ({ ...message }));
    return [...builtIn.map((message) => ({ ...message })), ...custom];
  }
  var DEFAULT_RUNTIME = Object.freeze({
    lastStandAt: (
      /** @type {number|null} */
      null
    ),
    nextDueAt: (
      /** @type {number|null} */
      null
    ),
    paused: false,
    todayKey: "",
    standCount: 0,
    snoozeCount: 0
  });
  function normalizeRuntime(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const finite = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
    return {
      lastStandAt: finite(source.lastStandAt),
      nextDueAt: finite(source.nextDueAt),
      paused: source.paused === true,
      todayKey: typeof source.todayKey === "string" ? source.todayKey.slice(0, 16) : "",
      standCount: Math.max(0, Math.min(9999, clampNumber(source.standCount, { min: 0, max: 9999 }, 0))),
      snoozeCount: Math.max(0, Math.min(9999, clampNumber(source.snoozeCount, { min: 0, max: 9999 }, 0)))
    };
  }
  function dayKey(now) {
    const date = new Date(now);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  // src/core/engine.js
  var TICK_MS = 1e3;
  function makeNotice(settings, language, previousText) {
    const pool = selectPool(settings, builtInMessages(language));
    if (pool.length === 0) return { text: "", group: "custom" };
    if (pool.length === 1) return { text: pool[0].text, group: pool[0].group };
    let pick = pool[0];
    for (let attempt = 0; attempt < 8; attempt += 1) {
      pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick.text !== previousText) break;
    }
    return { text: pick.text, group: pick.group };
  }
  var ReminderEngine = class {
    /** @param {EngineOptions} options */
    constructor({ storage, language = "zh", now = () => Date.now(), onEvent, tickMs = TICK_MS }) {
      this.storage = storage;
      this.language = language;
      this.now = now;
      this.onEvent = typeof onEvent === "function" ? onEvent : () => {
      };
      this.tickMs = tickMs;
      this.settings = this.#read(STORAGE_KEYS.settings, DEFAULT_SETTINGS, normalizeSettings);
      this.runtime = this.#read(STORAGE_KEYS.runtime, DEFAULT_RUNTIME, normalizeRuntime);
      this.notice = null;
      this.timer = null;
      this.disposed = false;
      this.listeners = /* @__PURE__ */ new Set();
      this.rollover(this.now());
      if (this.runtime.nextDueAt === null || this.runtime.lastStandAt === null) {
        this.runtime.lastStandAt = this.now();
        this.runtime.nextDueAt = this.runtime.lastStandAt + this.settings.intervalMinutes * 6e4;
        this.#persistRuntime();
      }
    }
    #read(key, fallback, normalize) {
      try {
        const raw = this.storage?.get?.(key);
        if (raw === null || raw === void 0) return { ...fallback };
        return normalize(JSON.parse(raw));
      } catch {
        return { ...fallback };
      }
    }
    #persistSettings() {
      try {
        this.storage?.set?.(STORAGE_KEYS.settings, JSON.stringify(this.settings));
      } catch {
      }
    }
    #persistRuntime() {
      try {
        this.storage?.set?.(STORAGE_KEYS.runtime, JSON.stringify(this.runtime));
      } catch {
      }
    }
    // -- lifecycle ------------------------------------------------------------
    start() {
      if (this.disposed || this.timer !== null) return;
      this.timer = setInterval(() => this.tick(), this.tickMs);
      this.timer?.unref?.();
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
      return () => {
        this.listeners.delete(listener);
      };
    }
    #emit(kind = "change", payload) {
      for (const listener of [...this.listeners]) {
        try {
          listener(this.snapshot());
        } catch {
        }
      }
      try {
        this.onEvent(kind, payload);
      } catch {
      }
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
      this.runtime.nextDueAt = now + this.settings.intervalMinutes * 6e4;
      this.#persistRuntime();
    }
    tick(now = this.now()) {
      if (this.disposed) return;
      this.rollover(now);
      if (this.notice !== null && this.notice.expiresAt !== null && now >= this.notice.expiresAt) {
        this.notice = null;
        this.#emit("change");
      }
      if (this.notice !== null) return;
      if (!this.settings.enabled || this.runtime.paused) return;
      const due = this.runtime.nextDueAt;
      if (due === null || now < due) return;
      this.#fire(now);
    }
    #fire(now) {
      const notice = makeNotice(this.settings, this.language, this.notice?.text);
      const expiresAt = this.settings.dismissAfterSeconds > 0 ? now + this.settings.dismissAfterSeconds * 1e3 : null;
      this.notice = { ...notice, shownAt: now, expiresAt, test: false };
      this.runtime.nextDueAt = now + this.settings.intervalMinutes * 6e4;
      this.#persistRuntime();
      const payload = { text: this.notice.text, group: this.notice.group, test: false };
      this.#emit("reminder", payload);
    }
    // -- user actions ---------------------------------------------------------
    /** "I got up" — clears the notice and restarts the interval from now. */
    standUp(now = this.now()) {
      this.rollover(now);
      this.notice = null;
      this.runtime.standCount += 1;
      this.runtime.lastStandAt = now;
      this.#scheduleNext(now);
      this.#emit("change");
      return this.snapshot();
    }
    snooze(minutes = LIMITS.snoozeMinutes.default, now = this.now()) {
      const delay = Math.min(
        LIMITS.snoozeMinutes.max,
        Math.max(LIMITS.snoozeMinutes.min, Math.round(Number(minutes) || LIMITS.snoozeMinutes.default))
      );
      this.notice = null;
      this.runtime.nextDueAt = now + delay * 6e4;
      this.runtime.snoozeCount += 1;
      this.#persistRuntime();
      this.#emit("change");
      return this.snapshot();
    }
    dismiss() {
      this.notice = null;
      this.#emit("change");
      return this.snapshot();
    }
    setPaused(paused, now = this.now()) {
      this.runtime.paused = paused === true;
      this.notice = this.runtime.paused ? null : this.notice;
      if (!this.runtime.paused) this.#scheduleNext(now);
      this.#persistRuntime();
      this.#emit("change");
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
      this.#emit("reminder", payload);
      return this.snapshot();
    }
    resetProgress(now = this.now()) {
      this.rollover(now);
      this.runtime.standCount = 0;
      this.runtime.snoozeCount = 0;
      this.notice = null;
      this.runtime.lastStandAt = now;
      this.#scheduleNext(now);
      this.#emit("change");
      return this.snapshot();
    }
    patchSettings(patch, now = this.now()) {
      const next = normalizeSettings({ ...this.settings, ...patch && typeof patch === "object" ? patch : {} });
      if (settingsEqual(next, this.settings)) return this.settings;
      const intervalChanged = next.intervalMinutes !== this.settings.intervalMinutes;
      const wasEnabled = this.settings.enabled;
      this.settings = next;
      this.#persistSettings();
      if (!next.enabled) {
        this.notice = null;
      } else if (!wasEnabled || intervalChanged) {
        this.runtime.lastStandAt = now;
        this.notice = null;
        this.#scheduleNext(now);
      }
      this.#emit("change");
      return this.settings;
    }
    setLanguage(language) {
      if (language === this.language) return;
      this.language = language;
      this.#emit("change");
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
          expiresAt: notice.expiresAt
        },
        poolSize: this.availablePoolSize()
      };
    }
  };

  // src/client/locale.js
  var MESSAGES = Object.freeze({
    zh: Object.freeze({
      "nav.label": "\u4E45\u5750\u63D0\u9192",
      "status.next": "{duration} \u540E\u63D0\u9192\u8D77\u8EAB",
      "status.paused": "\u4E45\u5750\u63D0\u9192\u5DF2\u6682\u505C",
      "status.due": "\u8BE5\u8D77\u8EAB\u4E86",
      "status.off": "\u4E45\u5750\u63D0\u9192\u5DF2\u5173\u95ED",
      "group.move": "\u8D70\u52A8\u4E00\u4E0B",
      "group.eyes": "\u653E\u677E\u773C\u775B",
      "group.posture": "\u6362\u4E2A\u59FF\u52BF",
      "group.habit": "\u5C0F\u63D0\u793A",
      "group.custom": "\u4F60\u7684\u6587\u6848",
      "duration.hm": "{hours} \u5C0F\u65F6 {minutes} \u5206\u949F",
      "duration.ms": "{minutes} \u5206 {seconds} \u79D2",
      "duration.s": "{seconds} \u79D2",
      "interval.minutes": "{minutes} \u5206\u949F",
      "interval.hours": "{hours} \u5C0F\u65F6",
      "notice.badge": "\u8D77\u8EAB\u65F6\u95F4\u5230\u4E86",
      "notice.badgeTest": "\u9884\u89C8\u63D0\u9192",
      "notice.gotUp": "\u6211\u8D77\u6765\u4E86",
      "notice.snooze": "{minutes} \u5206\u949F\u540E\u518D\u8BF4",
      "notice.dismiss": "\u5148\u4E0D\u7BA1",
      "settings.title": "\u4E45\u5750\u63D0\u9192",
      "settings.intro": "\u4E45\u5750\u5BF9\u8170\u690E\u3001\u9888\u690E\u548C\u8840\u6DB2\u5FAA\u73AF\u90FD\u4E0D\u53CB\u597D\u3002\u8BBE\u7F6E\u4E00\u4E2A\u95F4\u9694\uFF0C\u5230\u70B9\u63D0\u9192\u4F60\u7AD9\u8D77\u6765\u8D70\u52A8\u4E00\u4E0B\u3002",
      "settings.section.timer": "\u63D0\u9192\u8282\u594F",
      "settings.section.message": "\u63D0\u9192\u6587\u5B57",
      "settings.section.behavior": "\u63D0\u9192\u65B9\u5F0F",
      "settings.section.progress": "\u4ECA\u65E5\u8BB0\u5F55",
      "settings.enabled": "\u542F\u7528\u4E45\u5750\u63D0\u9192",
      "settings.enabledHint": "\u5173\u95ED\u540E\u4E0D\u518D\u8BA1\u65F6\u63D0\u9192\uFF0C\u8BBE\u7F6E\u4F1A\u4FDD\u7559\u3002",
      "settings.interval": "\u63D0\u9192\u95F4\u9694",
      "settings.intervalHint": "\u5230\u70B9\u540E\u4F1A\u5F39\u51FA\u4E00\u6761\u63D0\u9192\uFF0C\u76F4\u5230\u4F60\u8D77\u8EAB\u6216\u63A8\u8FDF\u3002",
      "settings.intervalUnit": "\u5206\u949F",
      "settings.intervalCustom": "\u81EA\u5B9A\u4E49\u5206\u949F\u6570",
      "settings.presets": "\u5E38\u7528\u95F4\u9694\uFF1A",
      "settings.pause": "\u6682\u505C\u4E00\u8F6E",
      "settings.resume": "\u7EE7\u7EED\u63D0\u9192",
      "settings.paused": "\u5DF2\u6682\u505C\uFF1A\u4E0D\u8BA1\u65F6\u4E5F\u4E0D\u63D0\u9192\uFF0C\u53D6\u6D88\u6682\u505C\u540E\u91CD\u65B0\u5F00\u59CB\u8BA1\u65F6\u3002",
      "settings.mode": "\u4F7F\u7528\u54EA\u4E9B\u6587\u5B57",
      "settings.mode.builtin": "\u53EA\u7528\u5185\u7F6E\u6587\u6848",
      "settings.mode.custom": "\u53EA\u7528\u6211\u5199\u7684\u6587\u6848",
      "settings.mode.mixed": "\u5185\u7F6E + \u6211\u5199\u7684",
      "settings.customLabel": "\u6211\u7684\u63D0\u9192\u6587\u5B57",
      "settings.customPlaceholder": "\u4F8B\u5982\uFF1A\u7AD9\u8D77\u6765\u8D70\u4E24\u5206\u949F\uFF0C\u987A\u4FBF\u770B\u770B\u7A97\u5916",
      "settings.customAdd": "\u6DFB\u52A0",
      "settings.customEmpty": "\u8FD8\u6CA1\u6709\u81EA\u5B9A\u4E49\u6587\u6848\u3002\u6DFB\u52A0\u540E\u6309\u4E0A\u9762\u7684\u9009\u62E9\u53C2\u4E0E\u8F6E\u64AD\u3002",
      "settings.customRemove": "\u5220\u9664",
      "settings.customCount": "{count} \u6761\u81EA\u5B9A\u4E49\u6587\u6848",
      "settings.poolSize": "\u5F53\u524D\u5171 {count} \u6761\u6587\u6848\u8F6E\u64AD",
      "settings.preview": "\u9884\u89C8",
      "settings.test": "\u7ACB\u5373\u8BD5\u4E00\u6B21",
      "settings.resetDefault": "\u6062\u590D\u5185\u7F6E\u6587\u6848",
      "settings.notifySystem": "\u540C\u65F6\u53D1\u9001\u7CFB\u7EDF\u901A\u77E5",
      "settings.notifySystemHint": "\u9875\u9762\u88AB\u6700\u5C0F\u5316\u6216\u5207\u5230\u540E\u53F0\u65F6\uFF0C\u4E5F\u80FD\u770B\u5230\u63D0\u9192\uFF08\u9700\u8981\u6D4F\u89C8\u5668\u6388\u6743\uFF09\u3002",
      "settings.notifyDenied": "\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u901A\u77E5\u6743\u9650\uFF0C\u53EF\u5728\u5730\u5740\u680F\u7684\u7AD9\u70B9\u8BBE\u7F6E\u91CC\u91CD\u65B0\u5141\u8BB8\u3002",
      "settings.sound": "\u63D0\u9192\u65F6\u64AD\u653E\u63D0\u793A\u97F3",
      "settings.autoDismiss": "\u81EA\u52A8\u5173\u95ED\u63D0\u9192",
      "settings.autoDismissOff": "\u4E0D\u81EA\u52A8\u5173\u95ED",
      "settings.autoDismissUnit": "\u79D2\u540E\u81EA\u52A8\u5173\u95ED",
      "settings.showStatus": "\u663E\u793A\u53F3\u4E0B\u89D2\u5012\u8BA1\u65F6",
      "settings.showStatusHint": "\u5E38\u9A7B\u4E00\u4E2A\u5C0F\u80F6\u56CA\u663E\u793A\u8DDD\u79BB\u4E0B\u6B21\u63D0\u9192\u7684\u65F6\u95F4\u3002",
      "settings.keepAwake": "\u63D0\u9192\u671F\u95F4\u4FDD\u6301\u5C4F\u5E55\u5E38\u4EAE",
      "settings.keepAwakeHint": "\u907F\u514D\u9501\u5C4F\u540E\u770B\u4E0D\u5230\u63D0\u9192\uFF1B\u9700\u8981\u6D4F\u89C8\u5668\u652F\u6301\uFF0C\u7701\u7535\u6A21\u5F0F\u4E0B\u53EF\u80FD\u5931\u6548\u3002",
      "settings.todayCount": "\u4ECA\u5929\u8D77\u8EAB\u6B21\u6570",
      "settings.snoozeLabel": "\u4ECA\u5929\u63A8\u8FDF\u6B21\u6570",
      "settings.snoozeHint": "\u63A8\u8FDF\u53EA\u662F\u628A\u8FD9\u4E00\u8F6E\u5F80\u540E\u632A\uFF0C\u4E0D\u8BA1\u5165\u8D77\u8EAB\u6B21\u6570\u3002",
      "settings.resetToday": "\u6E05\u7A7A\u4ECA\u65E5\u8BB0\u5F55",
      "settings.footer": "\u8BBE\u7F6E\u5B9E\u65F6\u4FDD\u5B58\u5728\u672C\u673A\u6D4F\u89C8\u5668\u4E2D\u3002\u63D0\u9192\u6587\u5B57\u652F\u6301\u81EA\u5B9A\u4E49\uFF0C\u4E5F\u53EF\u4EE5\u53EA\u7528\u5185\u7F6E\u6587\u6848\u3002"
    }),
    en: Object.freeze({
      "nav.label": "Stand-up reminder",
      "status.next": "Reminder in {duration}",
      "status.paused": "Stand-up reminder paused",
      "status.due": "Time to stand up",
      "status.off": "Stand-up reminder off",
      "group.move": "Move",
      "group.eyes": "Eyes",
      "group.posture": "Posture",
      "group.habit": "Nudge",
      "group.custom": "Your wording",
      "duration.hm": "{hours} h {minutes} min",
      "duration.ms": "{minutes} min {seconds} s",
      "duration.s": "{seconds} s",
      "interval.minutes": "{minutes} min",
      "interval.hours": "{hours} h",
      "notice.badge": "Time to stand up",
      "notice.badgeTest": "Reminder preview",
      "notice.gotUp": "I stood up",
      "notice.snooze": "Snooze {minutes} min",
      "notice.dismiss": "Not now",
      "settings.title": "Stand-up reminder",
      "settings.intro": "Long sitting sessions are hard on your back, neck and circulation. Pick an interval and get a nudge to stand up and move.",
      "settings.section.timer": "Rhythm",
      "settings.section.message": "Wording",
      "settings.section.behavior": "How it reminds you",
      "settings.section.progress": "Today",
      "settings.enabled": "Enable the reminder",
      "settings.enabledHint": "Turning this off stops the timer and keeps your settings.",
      "settings.interval": "Interval",
      "settings.intervalHint": "When the interval is up a reminder appears until you stand up or snooze it.",
      "settings.intervalUnit": "minutes",
      "settings.intervalCustom": "Custom minutes",
      "settings.presets": "Common:",
      "settings.pause": "Pause one round",
      "settings.resume": "Resume reminders",
      "settings.paused": "Paused: no counting and no reminders. Resuming restarts the countdown.",
      "settings.mode": "Which messages to use",
      "settings.mode.builtin": "Built-in wording only",
      "settings.mode.custom": "My wording only",
      "settings.mode.mixed": "Built-in + mine",
      "settings.customLabel": "My reminder messages",
      "settings.customPlaceholder": "e.g. Stand up for two minutes and look out of the window",
      "settings.customAdd": "Add",
      "settings.customEmpty": "No custom messages yet. Add one and pick how it should be used above.",
      "settings.customRemove": "Remove",
      "settings.customCount": "{count} custom message(s)",
      "settings.poolSize": "{count} message(s) in rotation",
      "settings.preview": "Preview",
      "settings.test": "Try it now",
      "settings.resetDefault": "Restore built-in wording",
      "settings.notifySystem": "Also send a system notification",
      "settings.notifySystemHint": "Keeps working when the window is minimised or in the background (needs browser permission).",
      "settings.notifyDenied": "The browser denied notification permission. Allow it in the site settings to use this.",
      "settings.sound": "Play a chime",
      "settings.autoDismiss": "Auto-dismiss the reminder",
      "settings.autoDismissOff": "Never auto-dismiss",
      "settings.autoDismissUnit": "seconds",
      "settings.showStatus": "Show the corner countdown",
      "settings.showStatusHint": "A small pill that always shows the time until the next reminder.",
      "settings.keepAwake": "Keep the screen awake",
      "settings.keepAwakeHint": "So a locked screen cannot swallow the reminder. Needs browser support; may fail in battery saver.",
      "settings.todayCount": "stand-up(s) today",
      "settings.snoozeLabel": "snooze(s) today",
      "settings.snoozeHint": "Snoozing pushes this round back without counting as a stand-up.",
      "settings.resetToday": "Clear today\u2019s record",
      "settings.footer": "Settings are stored in this browser. You can write your own wording or use the built-in messages only."
    })
  });
  function normalizeLanguage(language) {
    return typeof language === "string" && /^zh(?:$|[-_])/i.test(language.trim()) ? "zh" : "en";
  }
  function createLocaleStore(localeService) {
    let language = normalizeLanguage(readLanguage(localeService));
    const listeners = /* @__PURE__ */ new Set();
    let stop = () => {
    };
    const emit = () => {
      for (const listener of [...listeners]) {
        try {
          listener();
        } catch {
        }
      }
    };
    if (localeService && typeof localeService.subscribe === "function") {
      try {
        stop = localeService.subscribe(() => {
          const next = normalizeLanguage(readLanguage(localeService));
          if (next === language) return;
          language = next;
          emit();
        }) ?? (() => {
        });
      } catch {
      }
    }
    const store = {
      getLanguage: () => language,
      getDict: () => MESSAGES[language],
      /**
       * Closed over `language` rather than read from `this`: a translator handed
       * to another component (or to a Slot's `inject`) must not depend on being
       * called as a method.
       */
      t(key, values) {
        const template = MESSAGES[language][key] ?? MESSAGES.en[key];
        if (typeof template !== "string") return key;
        if (!values) return template;
        return template.replace(/\{(\w+)\}/g, (match, name2) => Object.hasOwn(values, name2) ? String(values[name2]) : match);
      },
      setLanguage(next) {
        const normalized = normalizeLanguage(next);
        if (normalized === language) return;
        language = normalized;
        emit();
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      }
    };
    store.dispose = () => {
      stop();
      listeners.clear();
    };
    return store;
  }
  function readLanguage(localeService) {
    if (!localeService) return void 0;
    const fromValue = (value) => {
      if (typeof value === "string") return value;
      if (!value || typeof value !== "object") return void 0;
      for (const key of ["active", "id", "language", "locale", "tag", "code", "name"]) {
        const candidate = value[key];
        if (typeof candidate === "string" && candidate !== "") return candidate;
      }
      return void 0;
    };
    try {
      for (const method of ["getLocale", "getSnapshot", "getLanguage"]) {
        if (typeof localeService[method] !== "function") continue;
        const resolved = fromValue(localeService[method]());
        if (resolved !== void 0) return resolved;
      }
    } catch {
    }
    try {
      return globalThis.document?.documentElement?.lang;
    } catch {
      return void 0;
    }
  }

  // src/client/notice.js
  var ROOT_ID = "dsh-stand-reminder-root";
  var CSS = `
#${ROOT_ID} { position: fixed; inset: 0; z-index: 40; pointer-events: none; }
#${ROOT_ID}, #${ROOT_ID} * { box-sizing: border-box; }
#${ROOT_ID} .dsr-toast {
  position: absolute; right: 24px; bottom: 88px; width: min(360px, calc(100vw - 32px));
  pointer-events: auto; display: flex; gap: 12px; padding: 16px;
  border-radius: 16px; border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  background: var(--dsw-alias-bg-overlay, #fff);
  color: var(--dsw-alias-label-primary, #0f1115);
  box-shadow: 0 18px 44px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.06);
  font-family: var(--dsw-font-family, inherit);
  animation: dsr-rise .22s cubic-bezier(.2,.8,.3,1);
}
#${ROOT_ID} .dsr-toast[data-test="true"] { border-style: dashed; }
@keyframes dsr-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { #${ROOT_ID} .dsr-toast { animation: none; } }
#${ROOT_ID} .dsr-icon {
  flex: 0 0 auto; width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 14%, transparent);
  color: var(--dsw-alias-state-warn-primary, #d97706);
}
#${ROOT_ID} .dsr-body { flex: 1 1 auto; min-width: 0; }
#${ROOT_ID} .dsr-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
#${ROOT_ID} .dsr-badge {
  font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  color: var(--dsw-alias-state-warn-primary, #d97706);
}
#${ROOT_ID} .dsr-group { font-size: 11px; color: var(--dsw-alias-label-secondary, #61666b); }
#${ROOT_ID} .dsr-text { margin: 0; font-size: 14px; line-height: 1.55; word-break: break-word; }
#${ROOT_ID} .dsr-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
#${ROOT_ID} .dsr-button {
  appearance: none; cursor: pointer; font: inherit; font-size: 13px;
  padding: 7px 13px; border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  background: var(--dsw-alias-bg-layer-2, #f5f6f7);
  color: var(--dsw-alias-label-primary, #0f1115);
  transition: filter .15s ease, background .15s ease;
}
#${ROOT_ID} .dsr-button:hover { filter: brightness(.97); }
#${ROOT_ID} .dsr-button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #0f1115); outline-offset: 2px; }
#${ROOT_ID} .dsr-button[data-primary="true"] {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary, #0f1115);
  color: var(--dsw-alias-label-primary-foreground, #fff);
}
#${ROOT_ID} .dsr-pill {
  position: absolute; right: 24px; bottom: 24px; pointer-events: auto;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 10px; border-radius: 999px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.06));
  background: var(--dsw-alias-bg-layer-2, #f5f6f7);
  color: var(--dsw-alias-label-secondary, #61666b);
  font-family: var(--dsw-font-family, inherit); font-size: 12px;
  font-variant-numeric: tabular-nums; cursor: pointer;
}
#${ROOT_ID} .dsr-pill:hover { color: var(--dsw-alias-label-primary, #0f1115); }
#${ROOT_ID} .dsr-pill:focus-visible { outline: 2px solid var(--dsw-brand-primary, var(--dsw-alias-brand-primary, #0f1115)); outline-offset: 2px; }
#${ROOT_ID} .dsr-pill[data-state="due"] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 45%, transparent);
  color: var(--dsw-alias-state-warn-primary, #d97706);
}
#${ROOT_ID} .dsr-pill[data-state="paused"], #${ROOT_ID} .dsr-pill[data-state="off"] { opacity: .72; }
#${ROOT_ID} .dsr-dot {
  width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto;
  background: currentColor;
}
#${ROOT_ID} .dsr-pill[data-state="due"] .dsr-dot { animation: dsr-pulse 1.4s ease-in-out infinite; }
@keyframes dsr-pulse { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
@media (prefers-reduced-motion: reduce) { #${ROOT_ID} .dsr-dot { animation: none !important; } }
`;
  var BELL_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`;
  function formatDuration(ms, t) {
    const total = Math.max(0, Math.ceil(ms / 1e3));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor(total % 3600 / 60);
    const seconds = total % 60;
    if (hours > 0) return t("duration.hm", { hours, minutes });
    if (minutes > 0) return t("duration.ms", { minutes, seconds });
    return t("duration.s", { seconds });
  }
  function createNoticeSurface({ engine, locale, onAction }) {
    const element = document.createElement("div");
    element.setAttribute("data-dsh-stand-reminder", "notice");
    element.style.display = "none";
    let root = null;
    let toast = null;
    let pill = null;
    let unsubscribe = null;
    let stopLocale = () => {
    };
    let rotate = null;
    let ticker = null;
    let rendered = null;
    let pillText = "";
    const button = (label, { primary = false, onClick }) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "dsr-button";
      if (primary) node.dataset.primary = "true";
      node.textContent = label;
      node.addEventListener("click", onClick);
      return node;
    };
    function buildToast() {
      const node = document.createElement("div");
      node.className = "dsr-toast";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      const icon = document.createElement("div");
      icon.className = "dsr-icon";
      icon.innerHTML = BELL_ICON;
      const body = document.createElement("div");
      body.className = "dsr-body";
      const head = document.createElement("div");
      head.className = "dsr-head";
      const badge = document.createElement("span");
      badge.className = "dsr-badge";
      const group = document.createElement("span");
      group.className = "dsr-group";
      head.append(badge, group);
      const text = document.createElement("p");
      text.className = "dsr-text";
      const actions = document.createElement("div");
      actions.className = "dsr-actions";
      body.append(head, text, actions);
      node.append(icon, body);
      node.__parts = { badge, group, text, actions };
      return node;
    }
    function paintActions(node, snapshot) {
      const { actions } = node.__parts;
      const info = snapshot.notice;
      const snoozeMinutes = snapshot.settings.snoozeMinutes;
      actions.replaceChildren();
      if (!info) return;
      if (!info.test) {
        actions.append(button(locale.t("notice.gotUp"), {
          primary: true,
          onClick: () => {
            engine.standUp();
            onAction?.("stand-up");
          }
        }));
      }
      actions.append(button(locale.t("notice.snooze", { minutes: snoozeMinutes }), {
        primary: info.test === true,
        onClick: () => {
          engine.snooze(snoozeMinutes);
          onAction?.("snooze");
        }
      }));
      actions.append(button(locale.t("notice.dismiss"), {
        onClick: () => {
          engine.dismiss();
          onAction?.("dismiss");
        }
      }));
    }
    function renderToast(snapshot) {
      const info = snapshot.notice;
      if (!info) {
        rendered = null;
        if (toast) {
          toast.remove();
          toast = null;
        }
        if (rotate !== null) {
          clearTimeout(rotate);
          rotate = null;
        }
        return;
      }
      if (!toast) {
        toast = buildToast();
        root.append(toast);
      }
      const { badge, group, text } = toast.__parts;
      badge.textContent = locale.t(info.test ? "notice.badgeTest" : "notice.badge");
      group.textContent = info.group === "custom" ? locale.t("group.custom") : locale.t(`group.${info.group}`);
      text.textContent = info.text;
      toast.dataset.test = String(info.test === true);
      const key = `${info.text}|${info.test}|${snapshot.settings.snoozeMinutes}|${locale.getLanguage()}`;
      if (rendered !== key) {
        rendered = key;
        paintActions(toast, snapshot);
      }
      if (rotate !== null) {
        clearTimeout(rotate);
        rotate = null;
      }
      if (info.expiresAt !== null && info.expiresAt !== void 0) {
        const delay = Math.max(0, info.expiresAt - Date.now());
        rotate = setTimeout(() => {
          rotate = null;
          if (engine.snapshot().notice === null) renderToast(engine.snapshot());
        }, delay + 50);
      }
    }
    function paintPill(snapshot) {
      const visible = snapshot.settings.showStatus && (snapshot.settings.enabled || snapshot.paused);
      if (!visible) {
        if (pill) {
          pill.remove();
          pill = null;
        }
        return;
      }
      if (!pill) {
        pill = document.createElement("button");
        pill.type = "button";
        pill.className = "dsr-pill";
        const dot = document.createElement("span");
        dot.className = "dsr-dot";
        const label = document.createElement("span");
        pill.append(dot, label);
        pill.__label = label;
        pill.addEventListener("click", () => onAction?.("open-settings"));
        root.append(pill);
      }
      const state = !snapshot.settings.enabled || snapshot.paused ? "paused" : snapshot.due || snapshot.notice ? "due" : "next";
      pill.dataset.state = state;
      let next;
      if (state === "due") next = locale.t("status.due");
      else if (snapshot.paused) next = locale.t("status.paused");
      else if (!snapshot.settings.enabled) next = locale.t("status.off");
      else next = locale.t("status.next", { duration: formatDuration(snapshot.remainingMs ?? 0, locale.t) });
      if (next !== pillText) {
        pillText = next;
        pill.__label.textContent = next;
      }
      pill.setAttribute("aria-label", next);
      pill.title = next;
    }
    function paint() {
      if (!root) return;
      const snapshot = engine.snapshot();
      renderToast(snapshot);
      paintPill(snapshot);
    }
    return {
      element,
      start() {
        root = document.createElement("div");
        root.id = ROOT_ID;
        const style = document.createElement("style");
        style.textContent = CSS;
        root.append(style);
        document.body.append(root);
        element.style.display = "";
        unsubscribe = engine.subscribe(paint);
        stopLocale = locale.subscribe(() => {
          rendered = null;
          pillText = "";
          paint();
        });
        ticker = setInterval(() => {
          if (!document.hidden) paint();
        }, 1e3);
        ticker?.unref?.();
        paint();
      },
      stop() {
        if (ticker !== null) {
          clearInterval(ticker);
          ticker = null;
        }
        if (rotate !== null) {
          clearTimeout(rotate);
          rotate = null;
        }
        unsubscribe?.();
        stopLocale();
        unsubscribe = null;
        stopLocale = () => {
        };
        root?.remove();
        root = null;
        toast = null;
        pill = null;
        rendered = null;
        pillText = "";
        element.style.display = "none";
      }
    };
  }

  // src/client/notify.js
  async function ensurePermission(scope = globalThis) {
    const Notification = scope?.Notification;
    if (typeof Notification !== "function") return "unsupported";
    if (Notification.permission === "granted" || Notification.permission === "denied") return Notification.permission;
    try {
      return await Notification.requestPermission();
    } catch {
      return "error";
    }
  }
  function showSystemNotification({ title, body, tag = "dsh-stand-reminder" }, scope = globalThis) {
    const Notification = scope?.Notification;
    if (typeof Notification !== "function" || Notification.permission !== "granted") return false;
    try {
      const notification = new Notification(title, { body, tag, silent: true });
      notification.onclick = () => {
        try {
          scope.focus?.();
          notification.close?.();
        } catch {
        }
      };
      return true;
    } catch {
      return false;
    }
  }
  function playChime(scope = globalThis) {
    const Ctor = scope?.AudioContext ?? scope?.webkitAudioContext;
    if (typeof Ctor !== "function") return false;
    try {
      const context = new Ctor();
      const start = context.currentTime;
      for (const [offset, frequency] of [[0, 660], [0.22, 880]]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(1e-4, start + offset);
        gain.gain.exponentialRampToValueAtTime(0.12, start + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(1e-4, start + offset + 0.2);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start + offset);
        oscillator.stop(start + offset + 0.24);
      }
      setTimeout(() => {
        void context.close?.();
      }, 900);
      return true;
    } catch {
      return false;
    }
  }

  // src/client/settings.jsx
  var import_react = __toESM(__require("react"), 1);

  // src/client/styles.js
  var SETTINGS_CSS = `
.dsh-sr { display: block; width: 100%; max-width: 720px; padding: 4px 0 40px; color: var(--dsw-alias-label-primary); }
.dsh-sr * { box-sizing: border-box; }
.dsh-sr h2 { margin: 0 0 6px; font-size: 17px; font-weight: 600; }
.dsh-sr p { margin: 0; }
.dsh-sr .dsh-sr-intro { font-size: 13px; line-height: 1.65; color: var(--dsw-alias-label-secondary); }
.dsh-sr-section { margin-top: 26px; }
.dsh-sr-section-title {
  margin: 0 0 10px; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
}
.dsh-sr-card {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1); overflow: hidden;
}
.dsh-sr-row { display: flex; gap: 16px; align-items: flex-start; justify-content: space-between; padding: 14px 16px; }
.dsh-sr-row + .dsh-sr-row { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-sr-row-main { min-width: 0; flex: 1 1 auto; }
.dsh-sr-row-control { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; }
.dsh-sr-label { font-size: 14px; font-weight: 500; }
.dsh-sr-hint { margin-top: 4px; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-secondary); }
.dsh-sr-warn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.dsh-sr-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 16px; align-items: center; }
.dsh-sr-chip {
  appearance: none; cursor: pointer; font: inherit; font-size: 13px;
  padding: 6px 12px; border-radius: 999px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary);
  transition: color .15s ease, border-color .15s ease, background .15s ease;
}
.dsh-sr-chip:hover { color: var(--dsw-alias-label-primary); }
.dsh-sr-chip[data-active="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);
  color: var(--dsw-alias-label-primary);
}
.dsh-sr-chip:focus-visible, .dsh-sr-button:focus-visible, .dsh-sr-input:focus-visible, .dsh-sr-switch:focus-visible, .dsh-sr-blur:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px;
}
.dsh-sr-input {
  appearance: none; font: inherit; font-size: 13px; min-width: 0;
  padding: 7px 10px; border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2, transparent); color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}
.dsh-sr-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .8; }
.dsh-sr-input[type="number"] { width: 88px; }
.dsh-sr-input[type="text"] { flex: 1 1 auto; }
.dsh-sr-button {
  appearance: none; cursor: pointer; font: inherit; font-size: 13px; white-space: nowrap;
  padding: 7px 13px; border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);
}
.dsh-sr-button:hover { filter: brightness(.97); }
.dsh-sr-button[disabled] { opacity: .5; cursor: default; }
.dsh-sr-button[data-primary="true"] {
  border-color: transparent; background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary-foreground, #fff);
}
.dsh-sr-button[data-danger="true"] { color: var(--dsw-alias-state-error-primary, #d92d20); }
.dsh-sr-switch { position: relative; display: inline-flex; flex: 0 0 auto; width: 38px; height: 22px; cursor: pointer; }
.dsh-sr-switch input { position: absolute; opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
.dsh-sr-switch span {
  position: absolute; inset: 0; border-radius: 999px;
  background: var(--dsw-alias-border-l2); transition: background .16s ease;
}
.dsh-sr-switch span::after {
  content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25);
  transition: transform .16s ease;
}
.dsh-sr-switch input:checked + span { background: var(--dsw-alias-brand-primary); }
.dsh-sr-switch input:checked + span::after { transform: translateX(16px); }
.dsh-sr-switch input:disabled + span { opacity: .5; }
.dsh-sr-message-list { display: flex; flex-direction: column; }
.dsh-sr-message {
  display: flex; gap: 12px; align-items: center; justify-content: space-between;
  padding: 11px 16px; font-size: 13px; line-height: 1.55;
}
.dsh-sr-message + .dsh-sr-message { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-sr-message-text { min-width: 0; word-break: break-word; }
.dsh-sr-empty { padding: 14px 16px; font-size: 13px; color: var(--dsw-alias-label-secondary); }
.dsh-sr-preview {
  padding: 16px; border-radius: 12px;
  border: 1px dashed var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
}
.dsh-sr-preview-badge {
  display: block; margin-bottom: 6px; font-size: 11px; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  color: var(--dsw-alias-state-warn-primary, #d97706);
}
.dsh-sr-preview-text { font-size: 14px; line-height: 1.6; }
.dsh-sr-add { display: flex; gap: 8px; align-items: center; padding: 14px 16px; }
.dsh-sr-add-row { display: flex; gap: 8px; padding: 14px 16px; align-items: center; }
.dsh-sr-footer { margin-top: 22px; font-size: 12px; line-height: 1.7; color: var(--dsw-alias-label-secondary); }
.dsh-sr-stats { display: flex; flex-wrap: wrap; gap: 10px; padding: 14px 16px; }
.dsh-sr-stat {
  display: inline-flex; align-items: baseline; gap: 6px;
  padding: 8px 14px; border-radius: 12px;
  border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-2);
}
.dsh-sr-stat b { font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; }
.dsh-sr-stat span { font-size: 12px; color: var(--dsw-alias-label-secondary); }
@media (prefers-reduced-motion: reduce) { .dsh-sr * { transition: none !important; } }
`;

  // src/client/settings.jsx
  var import_jsx_runtime = __require("react/jsx-runtime");
  var PRESET_INTERVALS = Object.freeze([15, 30, 45, 60, 90, 120]);
  var MODES = Object.freeze(["mixed", "builtin", "custom"]);
  var INTERVAL_CHIPS = [...PRESET_INTERVALS, "custom"];
  var stylesInjected = false;
  function ensureStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const style = document.createElement("style");
    style.setAttribute("data-dsh-stand-reminder", "settings-styles");
    style.textContent = SETTINGS_CSS;
    document.head.append(style);
  }
  function useSnapshot(engine) {
    const [snapshot, setSnapshot] = import_react.default.useState(() => engine.snapshot());
    import_react.default.useEffect(() => engine.subscribe(setSnapshot), [engine]);
    return snapshot;
  }
  function Switch({ checked, onChange, label, disabled }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-sr-switch", title: label, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          type: "checkbox",
          role: "switch",
          "aria-label": label,
          checked,
          disabled: disabled === true,
          onChange: (event) => onChange(event.currentTarget.checked)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
    ] });
  }
  function Row({ label, hint, children, warn = false }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-row-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-label", children: label }),
        hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: warn ? "dsh-sr-hint dsh-sr-warn" : "dsh-sr-hint", children: hint }) : null
      ] }),
      children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-row-control", children }) : null
    ] });
  }
  function Section({ title, children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh-sr-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "dsh-sr-section-title", children: title }),
      children
    ] });
  }
  function formatInterval(minutes, t) {
    if (minutes % 60 === 0 && minutes >= 60) return t("interval.hours", { hours: minutes / 60 });
    return t("interval.minutes", { minutes });
  }
  function SettingsPage({ engine, locale }) {
    ensureStyles();
    const snapshot = useSnapshot(engine);
    const settings = snapshot.settings;
    const t = locale.t;
    const [, forceLanguage] = import_react.default.useState(0);
    const inputRef = import_react.default.useRef(null);
    const [draft, setDraft] = import_react.default.useState("");
    const [noticeState, setNoticeState] = import_react.default.useState("unknown");
    import_react.default.useEffect(() => locale.subscribe(() => forceLanguage((value) => value + 1)), [locale]);
    import_react.default.useEffect(() => {
      const target = globalThis.window;
      if (typeof target?.addEventListener !== "function") return void 0;
      const onReveal = () => {
        inputRef.current?.scrollIntoView?.({ block: "center" });
        inputRef.current?.focus();
      };
      target.addEventListener("dsh-stand-reminder:reveal", onReveal);
      return () => target.removeEventListener("dsh-stand-reminder:reveal", onReveal);
    }, []);
    const patch = import_react.default.useCallback((next) => {
      engine.patchSettings(next);
    }, [engine]);
    const addDraft = () => {
      const message = draft.replace(/\s+/g, " ").trim();
      if (!message) return;
      patch({ customMessages: [...settings.customMessages, message] });
      setDraft("");
      inputRef.current?.focus();
    };
    const removeMessage = (index) => {
      patch({ customMessages: settings.customMessages.filter((_, position) => position !== index) });
    };
    const pickMode = (mode) => {
      if (mode === "custom" && settings.customMessages.length === 0) {
        patch({ messageMode: "mixed" });
        inputRef.current?.focus();
        return;
      }
      patch({ messageMode: mode });
    };
    const toggleSystemNotify = async (enabled) => {
      if (!enabled) {
        patch({ notifySystem: false });
        return;
      }
      const permission = await ensurePermission();
      setNoticeState(permission);
      patch({ notifySystem: permission === "granted" });
    };
    const preview = engine.messagePreview();
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t("settings.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-sr-intro", children: t("settings.intro") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { title: t("settings.section.timer"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.enabled"), hint: t("settings.enabledHint"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Switch,
          {
            checked: settings.enabled,
            label: t("settings.enabled"),
            onChange: (value) => patch({ enabled: value })
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Row,
          {
            label: t("settings.interval"),
            hint: snapshot.paused ? t("settings.paused") : t("settings.intervalHint"),
            warn: snapshot.paused,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "dsh-sr-button",
                onClick: () => engine.setPaused(!snapshot.paused),
                children: snapshot.paused ? t("settings.resume") : t("settings.pause")
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-chips", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sr-hint", children: t("settings.presets") }),
          INTERVAL_CHIPS.map((chip) => {
            if (chip === "custom") {
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-sr-row-control", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    className: "dsh-sr-input",
                    type: "number",
                    "aria-label": t("settings.intervalCustom"),
                    min: LIMITS.intervalMinutes.min,
                    max: LIMITS.intervalMinutes.max,
                    value: settings.intervalMinutes,
                    onChange: (event) => patch({ intervalMinutes: Number(event.currentTarget.value) })
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sr-hint", children: t("settings.intervalUnit") })
              ] }, "custom");
            }
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "dsh-sr-chip",
                "data-active": String(settings.intervalMinutes === chip),
                onClick: () => patch({ intervalMinutes: chip }),
                children: formatInterval(chip, t)
              },
              chip
            );
          })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { title: t("settings.section.message"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.mode"), hint: t("settings.poolSize", { count: snapshot.poolSize }), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-row-control", children: MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "dsh-sr-chip",
            "data-active": String(settings.messageMode === mode),
            onClick: () => pickMode(mode),
            children: t(`settings.mode.${mode}`)
          },
          mode
        )) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-chips", style: { display: "block" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-preview", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sr-preview-badge", children: t("settings.preview") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-preview-text", children: preview.text })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-sr-button", onClick: () => engine.testReminder(), children: t("settings.test") }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-row", style: { display: "block" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-label", children: t("settings.customLabel") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-sr-hint", children: t("settings.customCount", { count: settings.customMessages.length }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-add-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              ref: inputRef,
              className: "dsh-sr-input",
              type: "text",
              maxLength: LIMITS.customMessages.maxLength,
              placeholder: t("settings.customPlaceholder"),
              value: draft,
              onChange: (event) => setDraft(event.currentTarget.value),
              onKeyDown: (event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                addDraft();
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-sr-button",
              "data-primary": "true",
              disabled: draft.trim().length === 0,
              onClick: addDraft,
              children: t("settings.customAdd")
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sr-message-list", children: settings.customMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-sr-empty", children: t("settings.customEmpty") }) : settings.customMessages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-message", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sr-message-text", children: message }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-sr-button",
              "data-danger": "true",
              onClick: () => removeMessage(index),
              children: t("settings.customRemove")
            }
          )
        ] }, `${index}-${message}`)) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { title: t("settings.section.behavior"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Row,
          {
            label: t("settings.notifySystem"),
            hint: noticeState === "denied" ? t("settings.notifyDenied") : t("settings.notifySystemHint"),
            warn: noticeState === "denied",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Switch,
              {
                checked: settings.notifySystem,
                label: t("settings.notifySystem"),
                onChange: (value) => {
                  void toggleSystemNotify(value);
                }
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.sound"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Switch,
          {
            checked: settings.sound,
            label: t("settings.sound"),
            onChange: (value) => patch({ sound: value })
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.showStatus"), hint: t("settings.showStatusHint"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Switch,
          {
            checked: settings.showStatus,
            label: t("settings.showStatus"),
            onChange: (value) => patch({ showStatus: value })
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.keepAwake"), hint: t("settings.keepAwakeHint"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Switch,
          {
            checked: settings.keepAwake,
            label: t("settings.keepAwake"),
            onChange: (value) => patch({ keepAwake: value })
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.autoDismiss"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-row-control", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              className: "dsh-sr-input",
              type: "number",
              min: 0,
              max: LIMITS.dismissAfterSeconds.max,
              "aria-label": t("settings.autoDismiss"),
              value: settings.dismissAfterSeconds,
              onChange: (event) => patch({ dismissAfterSeconds: Number(event.currentTarget.value) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sr-hint", children: settings.dismissAfterSeconds === 0 ? t("settings.autoDismissOff") : t("settings.autoDismissUnit") })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { title: t("settings.section.progress"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sr-stats", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-sr-stat", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: snapshot.standCount }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settings.todayCount") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-sr-stat", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: snapshot.snoozeCount }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settings.snoozeLabel") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-sr-button", onClick: () => engine.resetProgress(), children: t("settings.resetToday") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, { label: t("settings.snoozeHint") })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-sr-footer", children: t("settings.footer") })
    ] });
  }

  // src/client/storage.js
  function createLocalStorageAdapter(scope = globalThis) {
    const memory = /* @__PURE__ */ new Map();
    let backing = null;
    try {
      backing = scope.localStorage ?? null;
      backing?.getItem("dsh-plugin-stand-reminder:probe");
    } catch {
      backing = null;
    }
    return {
      get(key) {
        try {
          if (backing) return backing.getItem(key);
        } catch {
        }
        return memory.has(key) ? memory.get(key) : null;
      },
      set(key, value) {
        memory.set(key, value);
        try {
          backing?.setItem(key, value);
        } catch {
        }
      }
    };
  }

  // src/client/wake-lock.js
  function createWakeLock(enabled, scope = globalThis) {
    const sentinel = scope?.navigator?.wakeLock;
    if (!enabled || typeof sentinel?.request !== "function") return () => {
    };
    let lock = null;
    let released = false;
    const acquire = async () => {
      if (released || lock !== null) return;
      try {
        const next = await sentinel.request("screen");
        if (released || scope.document?.hidden === true) {
          void next.release?.().catch?.(() => {
          });
          return;
        }
        lock = next;
        next.addEventListener?.("release", () => {
          lock = null;
        });
      } catch {
      }
    };
    const onVisibility = () => {
      if (scope.document?.hidden === false) void acquire();
    };
    scope.document?.addEventListener?.("visibilitychange", onVisibility);
    void acquire();
    return () => {
      if (released) return;
      released = true;
      scope.document?.removeEventListener?.("visibilitychange", onVisibility);
      const current = lock;
      lock = null;
      try {
        void current?.release?.();
      } catch {
      }
    };
  }

  // src/client/index.jsx
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var name = "dsh-plugin-stand-reminder-client";
  var inject = ["slots", "locale"];
  function useNoticeMount(surface) {
    import_react2.default.useEffect(() => {
      surface.start();
      return () => surface.stop();
    }, [surface]);
  }
  function apply(ctx) {
    const locale = createLocaleStore(ctx.locale);
    const storage = createLocalStorageAdapter();
    const engine = new ReminderEngine({
      storage,
      language: locale.getLanguage(),
      onEvent(kind, payload) {
        if (kind !== "reminder" || !payload) return;
        const settings = engine.settings;
        if (settings.sound) playChime();
        if (settings.notifySystem) {
          showSystemNotification({
            title: locale.t("notice.badge"),
            body: payload.text,
            tag: `dsh-stand-reminder-${payload.shownAt ?? Date.now()}`
          });
        }
      }
    });
    engine.start();
    const stopLocale = locale.subscribe(() => engine.setLanguage(locale.getLanguage()));
    let releaseWakeLock = () => {
    };
    const syncWakeLock = () => {
      releaseWakeLock();
      releaseWakeLock = createWakeLock(engine.settings.keepAwake);
    };
    const unsubscribeWakeLock = engine.subscribe(syncWakeLock);
    syncWakeLock();
    const surface = createNoticeSurface({
      engine,
      locale,
      onAction(kind) {
        if (kind !== "open-settings") return;
        try {
          globalThis.window?.dispatchEvent(new CustomEvent("dsh-stand-reminder:reveal"));
        } catch {
        }
      }
    });
    const NoticeSlot = () => {
      useNoticeMount(surface);
      return null;
    };
    ctx.slots.inject("shell.overlay", () => ctx.slots.register({
      name: "shell.overlay",
      id: "stand-reminder",
      order: 60,
      label: () => locale.t("nav.label")
    }, NoticeSlot));
    const SettingsSlot = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SettingsPage, { engine, locale });
    ctx.slots.inject("settings.section", () => ctx.slots.register({
      name: "settings.section",
      id: "stand-reminder",
      order: 35,
      label: () => locale.t("nav.label"),
      inject: () => ({ t: locale.t })
    }, SettingsSlot));
    if (engine.settings.notifySystem) void ensurePermission();
    ctx.effect(() => () => {
      unsubscribeWakeLock();
      releaseWakeLock();
      stopLocale();
      surface.stop();
      engine.dispose();
      locale.dispose();
    }, "dsh-plugin-stand-reminder: lifecycle");
  }
  return __toCommonJS(index_exports);
})();
return __dshStandReminderModule; } });
