/**
 * Client half.
 *
 * Two additive Slot contributions, nothing replaced:
 *   `shell.overlay`   – the reminder toast and the corner countdown;
 *   `settings.section` – the "Stand-up reminder" settings page.
 *
 * All state lives in one ReminderEngine instance; the UI only projects it.
 */
import React from 'react';

import { ReminderEngine } from '../core/engine.js';
import { createLocaleStore } from './locale.js';
import { createNoticeSurface } from './notice.js';
import { ensurePermission, playChime, showSystemNotification } from './notify.js';
import { SettingsPage } from './settings.jsx';
import { createLocalStorageAdapter } from './storage.js';
import { createWakeLock } from './wake-lock.js';

export const name = 'dsh-plugin-stand-reminder-client';
export const inject = ['slots', 'locale'];

/** Mount the vanilla notice surface for exactly as long as the Slot is mounted. */
function useNoticeMount(surface) {
  React.useEffect(() => {
    surface.start();
    return () => surface.stop();
  }, [surface]);
}

export function apply(ctx) {
  const locale = createLocaleStore(ctx.locale);
  const storage = createLocalStorageAdapter();
  const engine = new ReminderEngine({
    storage,
    language: locale.getLanguage(),
    onEvent(kind, payload) {
      if (kind !== 'reminder' || !payload) return;
      const settings = engine.settings;
      if (settings.sound) playChime();
      // Only a visible-page reminder needs the OS; the toast covers the rest.
      if (settings.notifySystem) {
        showSystemNotification({
          title: locale.t('notice.badge'),
          body: payload.text,
          tag: `dsh-stand-reminder-${payload.shownAt ?? Date.now()}`,
        });
      }
    },
  });
  engine.start();

  const stopLocale = locale.subscribe(() => engine.setLanguage(locale.getLanguage()));

  let releaseWakeLock = () => {};
  const syncWakeLock = () => {
    releaseWakeLock();
    releaseWakeLock = createWakeLock(engine.settings.keepAwake);
  };
  // The engine emits once per real state change; re-arming from scratch keeps
  // exactly one lock alive no matter how the setting is toggled.
  const unsubscribeWakeLock = engine.subscribe(syncWakeLock);
  syncWakeLock();

  const surface = createNoticeSurface({
    engine,
    locale,
    onAction(kind) {
      if (kind !== 'open-settings') return;
      // The settings page is only mounted while the panel is open; ask it to
      // show itself rather than reaching into panel navigation internals.
      try {
        globalThis.window?.dispatchEvent(new CustomEvent('dsh-stand-reminder:reveal'));
      } catch { /* events are optional */ }
    },
  });

  const NoticeSlot = () => {
    useNoticeMount(surface);
    return null;
  };

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'stand-reminder',
    order: 60,
    label: () => locale.t('nav.label'),
  }, NoticeSlot));

  const SettingsSlot = () => <SettingsPage engine={engine} locale={locale} />;

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'stand-reminder',
    order: 35,
    label: () => locale.t('nav.label'),
    inject: () => ({ t: locale.t }),
  }, SettingsSlot));

  // Prime the notification permission once, but only if the user asked for it.
  if (engine.settings.notifySystem) void ensurePermission();

  ctx.effect(() => () => {
    unsubscribeWakeLock();
    releaseWakeLock();
    stopLocale();
    surface.stop();
    engine.dispose();
    locale.dispose();
  }, 'dsh-plugin-stand-reminder: lifecycle');
}
