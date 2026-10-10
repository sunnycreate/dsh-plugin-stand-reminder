/**
 * Package-owned dictionary plus a tiny reactive locale store.
 *
 * The resolved language always comes from the host's locale service; this
 * module only picks zh vs en and exposes a subscribe() the UI can use.
 */

export const NS = 'dsh-plugin-stand-reminder';

export const MESSAGES = Object.freeze({
  zh: Object.freeze({
    'nav.label': '久坐提醒',
    'status.next': '{duration} 后提醒起身',
    'status.paused': '久坐提醒已暂停',
    'status.due': '该起身了',
    'status.off': '久坐提醒已关闭',

    'group.move': '走动一下',
    'group.eyes': '放松眼睛',
    'group.posture': '换个姿势',
    'group.habit': '小提示',
    'group.custom': '你的文案',

    'duration.hm': '{hours} 小时 {minutes} 分钟',
    'duration.ms': '{minutes} 分 {seconds} 秒',
    'duration.s': '{seconds} 秒',

    'interval.minutes': '{minutes} 分钟',
    'interval.hours': '{hours} 小时',

    'notice.badge': '起身时间到了',
    'notice.badgeTest': '预览提醒',
    'notice.gotUp': '我起来了',
    'notice.snooze': '{minutes} 分钟后再说',
    'notice.dismiss': '先不管',

    'settings.title': '久坐提醒',
    'settings.intro': '久坐对腰椎、颈椎和血液循环都不友好。设置一个间隔，到点提醒你站起来走动一下。',
    'settings.section.timer': '提醒节奏',
    'settings.section.message': '提醒文字',
    'settings.section.behavior': '提醒方式',
    'settings.section.progress': '今日记录',

    'settings.enabled': '启用久坐提醒',
    'settings.enabledHint': '关闭后不再计时提醒，设置会保留。',
    'settings.interval': '提醒间隔',
    'settings.intervalHint': '到点后会弹出一条提醒，直到你起身或推迟。',
    'settings.intervalUnit': '分钟',
    'settings.intervalCustom': '自定义分钟数',
    'settings.presets': '常用间隔：',
    'settings.pause': '暂停一轮',
    'settings.resume': '继续提醒',
    'settings.paused': '已暂停：不计时也不提醒，取消暂停后重新开始计时。',

    'settings.mode': '使用哪些文字',
    'settings.mode.builtin': '只用内置文案',
    'settings.mode.custom': '只用我写的文案',
    'settings.mode.mixed': '内置 + 我写的',
    'settings.customLabel': '我的提醒文字',
    'settings.customPlaceholder': '例如：站起来走两分钟，顺便看看窗外',
    'settings.customAdd': '添加',
    'settings.customEmpty': '还没有自定义文案。添加后按上面的选择参与轮播。',
    'settings.customRemove': '删除',
    'settings.customCount': '{count} 条自定义文案',
    'settings.poolSize': '当前共 {count} 条文案轮播',
    'settings.preview': '预览',
    'settings.test': '立即试一次',
    'settings.resetDefault': '恢复内置文案',

    'settings.notifySystem': '同时发送系统通知',
    'settings.notifySystemHint': '页面被最小化或切到后台时，也能看到提醒（需要浏览器授权）。',
    'settings.notifyDenied': '浏览器拒绝了通知权限，可在地址栏的站点设置里重新允许。',
    'settings.sound': '提醒时播放提示音',
    'settings.autoDismiss': '自动关闭提醒',
    'settings.autoDismissOff': '不自动关闭',
    'settings.autoDismissUnit': '秒后自动关闭',
    'settings.showStatus': '显示右下角倒计时',
    'settings.showStatusHint': '常驻一个小胶囊显示距离下次提醒的时间。',
    'settings.keepAwake': '提醒期间保持屏幕常亮',
    'settings.keepAwakeHint': '避免锁屏后看不到提醒；需要浏览器支持，省电模式下可能失效。',

    'settings.todayCount': '今天起身次数',
    'settings.snoozeLabel': '今天推迟次数',
    'settings.snoozeHint': '推迟只是把这一轮往后挪，不计入起身次数。',
    'settings.resetToday': '清空今日记录',

    'settings.footer': '设置实时保存在本机浏览器中。提醒文字支持自定义，也可以只用内置文案。',
  }),

  en: Object.freeze({
    'nav.label': 'Stand-up reminder',
    'status.next': 'Reminder in {duration}',
    'status.paused': 'Stand-up reminder paused',
    'status.due': 'Time to stand up',
    'status.off': 'Stand-up reminder off',

    'group.move': 'Move',
    'group.eyes': 'Eyes',
    'group.posture': 'Posture',
    'group.habit': 'Nudge',
    'group.custom': 'Your wording',

    'duration.hm': '{hours} h {minutes} min',
    'duration.ms': '{minutes} min {seconds} s',
    'duration.s': '{seconds} s',

    'interval.minutes': '{minutes} min',
    'interval.hours': '{hours} h',

    'notice.badge': 'Time to stand up',
    'notice.badgeTest': 'Reminder preview',
    'notice.gotUp': 'I stood up',
    'notice.snooze': 'Snooze {minutes} min',
    'notice.dismiss': 'Not now',

    'settings.title': 'Stand-up reminder',
    'settings.intro': 'Long sitting sessions are hard on your back, neck and circulation. Pick an interval and get a nudge to stand up and move.',
    'settings.section.timer': 'Rhythm',
    'settings.section.message': 'Wording',
    'settings.section.behavior': 'How it reminds you',
    'settings.section.progress': 'Today',

    'settings.enabled': 'Enable the reminder',
    'settings.enabledHint': 'Turning this off stops the timer and keeps your settings.',
    'settings.interval': 'Interval',
    'settings.intervalHint': 'When the interval is up a reminder appears until you stand up or snooze it.',
    'settings.intervalUnit': 'minutes',
    'settings.intervalCustom': 'Custom minutes',
    'settings.presets': 'Common:',
    'settings.pause': 'Pause one round',
    'settings.resume': 'Resume reminders',
    'settings.paused': 'Paused: no counting and no reminders. Resuming restarts the countdown.',
    'settings.mode': 'Which messages to use',
    'settings.mode.builtin': 'Built-in wording only',
    'settings.mode.custom': 'My wording only',
    'settings.mode.mixed': 'Built-in + mine',
    'settings.customLabel': 'My reminder messages',
    'settings.customPlaceholder': 'e.g. Stand up for two minutes and look out of the window',
    'settings.customAdd': 'Add',
    'settings.customEmpty': 'No custom messages yet. Add one and pick how it should be used above.',
    'settings.customRemove': 'Remove',
    'settings.customCount': '{count} custom message(s)',
    'settings.poolSize': '{count} message(s) in rotation',
    'settings.preview': 'Preview',
    'settings.test': 'Try it now',
    'settings.resetDefault': 'Restore built-in wording',

    'settings.notifySystem': 'Also send a system notification',
    'settings.notifySystemHint': 'Keeps working when the window is minimised or in the background (needs browser permission).',
    'settings.notifyDenied': 'The browser denied notification permission. Allow it in the site settings to use this.',
    'settings.sound': 'Play a chime',
    'settings.autoDismiss': 'Auto-dismiss the reminder',
    'settings.autoDismissOff': 'Never auto-dismiss',
    'settings.autoDismissUnit': 'seconds',
    'settings.showStatus': 'Show the corner countdown',
    'settings.showStatusHint': 'A small pill that always shows the time until the next reminder.',
    'settings.keepAwake': 'Keep the screen awake',
    'settings.keepAwakeHint': 'So a locked screen cannot swallow the reminder. Needs browser support; may fail in battery saver.',

    'settings.todayCount': 'stand-up(s) today',
    'settings.snoozeLabel': 'snooze(s) today',
    'settings.snoozeHint': 'Snoozing pushes this round back without counting as a stand-up.',
    'settings.resetToday': 'Clear today’s record',

    'settings.footer': 'Settings are stored in this browser. You can write your own wording or use the built-in messages only.',
  }),
});

/**
 * @typedef {object} LocaleStore
 * @property {() => string} getLanguage
 * @property {() => 'zh'|'en'} getDict
 * @property {(key: string, values?: Record<string, unknown>) => string} t
 * @property {() => void} setLanguage
 * @property {(listener: () => void) => () => void} subscribe
 */

export function normalizeLanguage(language) {
  return typeof language === 'string' && /^zh(?:$|[-_])/i.test(language.trim()) ? 'zh' : 'en';
}

/**
 * Create the store and wire it to the host locale service.
 * @param {unknown} localeService the `locale` client service (optional)
 */
export function createLocaleStore(localeService) {
  let language = normalizeLanguage(readLanguage(localeService));
  const listeners = new Set();
  let stop = () => {};

  const emit = () => {
    for (const listener of [...listeners]) {
      try { listener(); } catch { /* a bad subscriber must not break the UI */ }
    }
  };

  if (localeService && typeof localeService.subscribe === 'function') {
    try {
      stop = localeService.subscribe(() => {
        const next = normalizeLanguage(readLanguage(localeService));
        if (next === language) return;
        language = next;
        emit();
      }) ?? (() => {});
    } catch { /* locale observation is optional */ }
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
      if (typeof template !== 'string') return key;
      if (!values) return template;
      return template.replace(/\{(\w+)\}/g, (match, name) => (
        Object.hasOwn(values, name) ? String(values[name]) : match
      ));
    },
    setLanguage(next) {
      const normalized = normalizeLanguage(next);
      if (normalized === language) return;
      language = normalized;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
  // `stop` is retained for the caller's disposal; the store itself stays pure.
  store.dispose = () => { stop(); listeners.clear(); };
  return store;
}

/**
 * Read the current language from whichever shape the host locale service has.
 *
 * The documented snapshot is `{ active, locales, revision }`; older or wrapped
 * faces expose the id under other names, so every shape that can carry a tag is
 * probed before giving up. Getting this wrong is silent — the UI would simply
 * render English — so each candidate is checked by shape, not by name alone.
 */
function readLanguage(localeService) {
  if (!localeService) return undefined;
  const fromValue = value => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return undefined;
    for (const key of ['active', 'id', 'language', 'locale', 'tag', 'code', 'name']) {
      const candidate = value[key];
      if (typeof candidate === 'string' && candidate !== '') return candidate;
    }
    return undefined;
  };
  try {
    // `getLanguage` is not a documented member but is cheap to probe; the two
    // snapshot readers cover every shipped face.
    for (const method of ['getLocale', 'getSnapshot', 'getLanguage']) {
      if (typeof localeService[method] !== 'function') continue;
      const resolved = fromValue(localeService[method]());
      if (resolved !== undefined) return resolved;
    }
  } catch { /* fall through to the document language */ }
  try {
    return globalThis.document?.documentElement?.lang;
  } catch {
    return undefined;
  }
}
