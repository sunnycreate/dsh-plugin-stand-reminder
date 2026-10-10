import React from 'react';

import { LIMITS } from '../core/settings.js';
import { ensurePermission } from './notify.js';
import { SETTINGS_CSS } from './styles.js';

const PRESET_INTERVALS = Object.freeze([15, 30, 45, 60, 90, 120]);
const MODES = Object.freeze(['mixed', 'builtin', 'custom']);

/** Preset chips plus an exact minute field. */
const INTERVAL_CHIPS = [...PRESET_INTERVALS, 'custom'];

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-dsh-stand-reminder', 'settings-styles');
  style.textContent = SETTINGS_CSS;
  document.head.append(style);
}

/** Subscribe to the live engine snapshot. */
function useSnapshot(engine) {
  const [snapshot, setSnapshot] = React.useState(() => engine.snapshot());
  React.useEffect(() => engine.subscribe(setSnapshot), [engine]);
  return snapshot;
}

function Switch({ checked, onChange, label, disabled }) {
  return (
    <label className="dsh-sr-switch" title={label}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        disabled={disabled === true}
        onChange={event => onChange(event.currentTarget.checked)}
      />
      <span />
    </label>
  );
}

function Row({ label, hint, children, warn = false }) {
  return (
    <div className="dsh-sr-row">
      <div className="dsh-sr-row-main">
        <div className="dsh-sr-label">{label}</div>
        {hint ? <p className={warn ? 'dsh-sr-hint dsh-sr-warn' : 'dsh-sr-hint'}>{hint}</p> : null}
      </div>
      {children ? <div className="dsh-sr-row-control">{children}</div> : null}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="dsh-sr-section">
      <h3 className="dsh-sr-section-title">{title}</h3>
      {children}
    </section>
  );
}

/** Human-readable interval, e.g. "45 分钟" or "2 小时". */
function formatInterval(minutes, t) {
  if (minutes % 60 === 0 && minutes >= 60) return t('interval.hours', { hours: minutes / 60 });
  return t('interval.minutes', { minutes });
}

/**
 * @param {{ engine: object, locale: object }} props
 */
export function SettingsPage({ engine, locale }) {
  ensureStyles();
  const snapshot = useSnapshot(engine);
  const settings = snapshot.settings;
  const t = locale.t;
  const [, forceLanguage] = React.useState(0);
  const inputRef = React.useRef(null);
  const [draft, setDraft] = React.useState('');
  const [noticeState, setNoticeState] = React.useState('unknown');

  React.useEffect(() => locale.subscribe(() => forceLanguage(value => value + 1)), [locale]);

  // The corner countdown asks the open settings page to show itself.
  React.useEffect(() => {
    const target = globalThis.window;
    if (typeof target?.addEventListener !== 'function') return undefined;
    const onReveal = () => {
      inputRef.current?.scrollIntoView?.({ block: 'center' });
      inputRef.current?.focus();
    };
    target.addEventListener('dsh-stand-reminder:reveal', onReveal);
    return () => target.removeEventListener('dsh-stand-reminder:reveal', onReveal);
  }, []);

  const patch = React.useCallback(next => { engine.patchSettings(next); }, [engine]);

  const addDraft = () => {
    const message = draft.replace(/\s+/g, ' ').trim();
    if (!message) return;
    patch({ customMessages: [...settings.customMessages, message] });
    setDraft('');
    inputRef.current?.focus();
  };

  const removeMessage = index => {
    patch({ customMessages: settings.customMessages.filter((_, position) => position !== index) });
  };

  const pickMode = mode => {
    if (mode === 'custom' && settings.customMessages.length === 0) {
      // Nothing to show under a custom-only pool; start from a usable state.
      patch({ messageMode: 'mixed' });
      inputRef.current?.focus();
      return;
    }
    patch({ messageMode: mode });
  };

  const toggleSystemNotify = async enabled => {
    if (!enabled) {
      patch({ notifySystem: false });
      return;
    }
    const permission = await ensurePermission();
    setNoticeState(permission);
    patch({ notifySystem: permission === 'granted' });
  };

  const preview = engine.messagePreview();

  return (
    <div className="dsh-sr">
      <h2>{t('settings.title')}</h2>
      <p className="dsh-sr-intro">{t('settings.intro')}</p>

      <Section title={t('settings.section.timer')}>
        <div className="dsh-sr-card">
          <Row label={t('settings.enabled')} hint={t('settings.enabledHint')}>
            <Switch
              checked={settings.enabled}
              label={t('settings.enabled')}
              onChange={value => patch({ enabled: value })}
            />
          </Row>
          <Row
            label={t('settings.interval')}
            hint={snapshot.paused ? t('settings.paused') : t('settings.intervalHint')}
            warn={snapshot.paused}
          >
            <button
              type="button"
              className="dsh-sr-button"
              onClick={() => engine.setPaused(!snapshot.paused)}
            >
              {snapshot.paused ? t('settings.resume') : t('settings.pause')}
            </button>
          </Row>
          <div className="dsh-sr-chips">
            <span className="dsh-sr-hint">{t('settings.presets')}</span>
            {INTERVAL_CHIPS.map(chip => {
              if (chip === 'custom') {
                return (
                  <span key="custom" className="dsh-sr-row-control">
                    <input
                      className="dsh-sr-input"
                      type="number"
                      aria-label={t('settings.intervalCustom')}
                      min={LIMITS.intervalMinutes.min}
                      max={LIMITS.intervalMinutes.max}
                      value={settings.intervalMinutes}
                      onChange={event => patch({ intervalMinutes: Number(event.currentTarget.value) })}
                    />
                    <span className="dsh-sr-hint">{t('settings.intervalUnit')}</span>
                  </span>
                );
              }
              return (
                <button
                  key={chip}
                  type="button"
                  className="dsh-sr-chip"
                  data-active={String(settings.intervalMinutes === chip)}
                  onClick={() => patch({ intervalMinutes: chip })}
                >
                  {formatInterval(chip, t)}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title={t('settings.section.message')}>
        <div className="dsh-sr-card">
          <Row label={t('settings.mode')} hint={t('settings.poolSize', { count: snapshot.poolSize })}>
            <div className="dsh-sr-row-control">
              {MODES.map(mode => (
                <button
                  key={mode}
                  type="button"
                  className="dsh-sr-chip"
                  data-active={String(settings.messageMode === mode)}
                  onClick={() => pickMode(mode)}
                >
                  {t(`settings.mode.${mode}`)}
                </button>
              ))}
            </div>
          </Row>
          <div className="dsh-sr-chips" style={{ display: 'block' }}>
            <div className="dsh-sr-preview">
              <span className="dsh-sr-preview-badge">{t('settings.preview')}</span>
              <div className="dsh-sr-preview-text">{preview.text}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="button" className="dsh-sr-button" onClick={() => engine.testReminder()}>
                {t('settings.test')}
              </button>
            </div>
          </div>
          <div className="dsh-sr-row" style={{ display: 'block' }}>
            <div className="dsh-sr-label">{t('settings.customLabel')}</div>
            <p className="dsh-sr-hint">{t('settings.customCount', { count: settings.customMessages.length })}</p>
          </div>
          <div className="dsh-sr-add-row">
            <input
              ref={inputRef}
              className="dsh-sr-input"
              type="text"
              maxLength={LIMITS.customMessages.maxLength}
              placeholder={t('settings.customPlaceholder')}
              value={draft}
              onChange={event => setDraft(event.currentTarget.value)}
              onKeyDown={event => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                addDraft();
              }}
            />
            <button
              type="button"
              className="dsh-sr-button"
              data-primary="true"
              disabled={draft.trim().length === 0}
              onClick={addDraft}
            >
              {t('settings.customAdd')}
            </button>
          </div>
          <div className="dsh-sr-message-list">
            {settings.customMessages.length === 0
              ? <p className="dsh-sr-empty">{t('settings.customEmpty')}</p>
              : settings.customMessages.map((message, index) => (
                <div className="dsh-sr-message" key={`${index}-${message}`}>
                  <span className="dsh-sr-message-text">{message}</span>
                  <button
                    type="button"
                    className="dsh-sr-button"
                    data-danger="true"
                    onClick={() => removeMessage(index)}
                  >
                    {t('settings.customRemove')}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </Section>

      <Section title={t('settings.section.behavior')}>
        <div className="dsh-sr-card">
          <Row
            label={t('settings.notifySystem')}
            hint={noticeState === 'denied' ? t('settings.notifyDenied') : t('settings.notifySystemHint')}
            warn={noticeState === 'denied'}
          >
            <Switch
              checked={settings.notifySystem}
              label={t('settings.notifySystem')}
              onChange={value => { void toggleSystemNotify(value); }}
            />
          </Row>
          <Row label={t('settings.sound')}>
            <Switch
              checked={settings.sound}
              label={t('settings.sound')}
              onChange={value => patch({ sound: value })}
            />
          </Row>
          <Row label={t('settings.showStatus')} hint={t('settings.showStatusHint')}>
            <Switch
              checked={settings.showStatus}
              label={t('settings.showStatus')}
              onChange={value => patch({ showStatus: value })}
            />
          </Row>
          <Row label={t('settings.keepAwake')} hint={t('settings.keepAwakeHint')}>
            <Switch
              checked={settings.keepAwake}
              label={t('settings.keepAwake')}
              onChange={value => patch({ keepAwake: value })}
            />
          </Row>
          <Row label={t('settings.autoDismiss')}>
            <div className="dsh-sr-row-control">
              <input
                className="dsh-sr-input"
                type="number"
                min={0}
                max={LIMITS.dismissAfterSeconds.max}
                aria-label={t('settings.autoDismiss')}
                value={settings.dismissAfterSeconds}
                onChange={event => patch({ dismissAfterSeconds: Number(event.currentTarget.value) })}
              />
              <span className="dsh-sr-hint">
                {settings.dismissAfterSeconds === 0 ? t('settings.autoDismissOff') : t('settings.autoDismissUnit')}
              </span>
            </div>
          </Row>
        </div>
      </Section>

      <Section title={t('settings.section.progress')}>
        <div className="dsh-sr-card">
          <div className="dsh-sr-stats">
            <span className="dsh-sr-stat">
              <b>{snapshot.standCount}</b>
              <span>{t('settings.todayCount')}</span>
            </span>
            <span className="dsh-sr-stat">
              <b>{snapshot.snoozeCount}</b>
              <span>{t('settings.snoozeLabel')}</span>
            </span>
            <button type="button" className="dsh-sr-button" onClick={() => engine.resetProgress()}>
              {t('settings.resetToday')}
            </button>
          </div>
          <Row label={t('settings.snoozeHint')} />
        </div>
      </Section>

      <p className="dsh-sr-footer">{t('settings.footer')}</p>
    </div>
  );
}
