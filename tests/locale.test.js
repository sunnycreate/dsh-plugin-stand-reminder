/**
 * Locale store tests.
 *
 * The translator is handed around a lot (a Slot `inject` face, a vanilla DOM
 * surface, a settings component), so it must not depend on being invoked as a
 * method. That regression is covered explicitly below.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { MESSAGES, createLocaleStore, normalizeLanguage } from '../src/client/locale.js';

/**
 * A stand-in for the host locale service.
 *
 * The shape matters: the documented snapshot is `{ active, locales, revision }`,
 * and reading the language out of it is the one fragile part of the store.
 */
function fakeLocaleService(initial = 'zh-CN') {
  let active = initial;
  const listeners = new Set();
  const snapshot = () => ({ active, locales: [{ id: 'en', label: 'English' }, { id: 'zh-CN', label: '简体中文' }], revision: 1 });
  return {
    getLocale: snapshot,
    getSnapshot: snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    set(next) {
      active = next;
      for (const listener of [...listeners]) listener();
    },
  };
}

test('the language is read from the documented { active } snapshot', () => {
  const store = createLocaleStore(fakeLocaleService('zh-CN'));
  assert.equal(store.getLanguage(), 'zh', 'reading the wrong snapshot field silently forces English');
  assert.equal(store.t('settings.title'), '久坐提醒');
});

test('every plausible snapshot shape resolves, and a broken one falls back', () => {
  const shapes = [
    { getLocale: () => ({ active: 'zh-TW' }) },
    { getLocale: () => ({ id: 'zh' }) },
    { getLocale: () => ({ language: 'zh-Hans' }) },
    { getLocale: () => 'zh-CN' },
    { getLanguage: () => 'zh' },
    { getSnapshot: () => ({ active: 'zh', revision: 0, locales: [] }) },
  ];
  for (const service of shapes) {
    assert.equal(createLocaleStore(service).getLanguage(), 'zh', `failed for ${Object.keys(service)[0]}`);
  }
  // No usable source at all: fall back rather than throw.
  assert.doesNotThrow(() => createLocaleStore({ getLocale: () => ({ revision: 3 }) }));
  assert.doesNotThrow(() => createLocaleStore({}));
  assert.equal(createLocaleStore(null).getLanguage(), 'en');
});

test('the language tag picks the right dictionary', () => {
  assert.equal(normalizeLanguage('zh'), 'zh');
  assert.equal(normalizeLanguage('zh-Hans-CN'), 'zh');
  assert.equal(normalizeLanguage('ZH_cn'), 'zh');
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage(undefined), 'en');
  assert.equal(normalizeLanguage(42), 'en');
});

test('the translator works when detached from the store', () => {
  const store = createLocaleStore(fakeLocaleService('zh-CN'));
  const { t } = store;
  assert.equal(t('settings.title'), '久坐提醒');
  assert.equal(t('settings.enabled'), '启用久坐提醒');
});

test('the translator interpolates and falls back safely', () => {
  const store = createLocaleStore(fakeLocaleService('zh-CN'));
  const { t } = store;
  assert.equal(t('duration.hm', { hours: 1, minutes: 5 }), '1 小时 5 分钟');
  assert.equal(t('notice.snooze', { minutes: 10 }), '10 分钟后再说');
  assert.equal(t('duration.hm', { hours: 2 }), '2 小时 {minutes} 分钟', 'missing values stay visible');
  assert.equal(t('no.such.key'), 'no.such.key', 'an unknown key echoes itself');
});

test('the store follows the host locale and notifies subscribers', () => {
  const service = fakeLocaleService('en-US');
  const store = createLocaleStore(service);
  assert.equal(store.getLanguage(), 'en');
  assert.equal(store.t('settings.title'), 'Stand-up reminder');

  let notified = 0;
  const unsubscribe = store.subscribe(() => { notified += 1; });
  service.set('zh-CN');
  assert.equal(notified, 1);
  assert.equal(store.getLanguage(), 'zh');
  assert.equal(store.t('settings.title'), '久坐提醒');

  // A same-language event must not churn the UI.
  service.set('zh-Hans');
  assert.equal(notified, 1);
  unsubscribe();
  service.set('en-US');
  assert.equal(notified, 1, 'an unsubscribed listener is never called again');
});

test('a host locale service that throws still yields a usable store', () => {
  const hostile = {
    getLocale() { throw new Error('not ready'); },
    subscribe() { throw new Error('not ready'); },
  };
  const store = createLocaleStore(hostile);
  assert.equal(typeof store.t, 'function');
  assert.ok(store.t('settings.title').length > 0);
});

test('zh and en dictionaries cover exactly the same keys', () => {
  const zh = Object.keys(MESSAGES.zh).sort();
  const en = Object.keys(MESSAGES.en).sort();
  assert.deepEqual(zh, en, 'a missing translation would surface as a raw key');
  assert.ok(zh.length > 40, 'the dictionary should cover the whole page');
});
