/**
 * Frame-wide reminder surface.
 *
 * Rendered as plain DOM inside the `shell.overlay` slot for two reasons:
 *  - the overlay layer is click-through, so the surface has to opt into pointer
 *    events itself;
 *  - the two heavy pieces (a corner countdown that ticks every second, and a
 *    toast) then cost no React re-renders and no hook-order risk in a slot whose
 *    standard props vary with the host version.
 *
 * The element returned to the slot is inert; everything visible is appended to
 * `document.body` from inside `start()` and removed again by `stop()`.
 */
import { GROUP_ORDER } from '../core/messages.js';

const ROOT_ID = 'dsh-stand-reminder-root';

const CSS = `
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

const BELL_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`;

/** "1 小时 5 分钟" / "1 h 5 min" — compact, and never shows 0 seconds. */
function formatDuration(ms, t) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return t('duration.hm', { hours, minutes });
  if (minutes > 0) return t('duration.ms', { minutes, seconds });
  return t('duration.s', { seconds });
}

/**
 * @param {{ engine: object, locale: object, onAction?: (kind: string, payload?: unknown) => void }} deps
 */
export function createNoticeSurface({ engine, locale, onAction }) {
  const element = document.createElement('div');
  element.setAttribute('data-dsh-stand-reminder', 'notice');
  element.style.display = 'none';

  let root = null;
  let toast = null;
  let pill = null;
  let unsubscribe = null;
  let stopLocale = () => {};
  let rotate = null;
  let ticker = null;
  let rendered = null;
  let pillText = '';

  const button = (label, { primary = false, onClick }) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'dsr-button';
    if (primary) node.dataset.primary = 'true';
    node.textContent = label;
    node.addEventListener('click', onClick);
    return node;
  };

  function buildToast() {
    const node = document.createElement('div');
    node.className = 'dsr-toast';
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');

    const icon = document.createElement('div');
    icon.className = 'dsr-icon';
    icon.innerHTML = BELL_ICON;

    const body = document.createElement('div');
    body.className = 'dsr-body';

    const head = document.createElement('div');
    head.className = 'dsr-head';
    const badge = document.createElement('span');
    badge.className = 'dsr-badge';
    const group = document.createElement('span');
    group.className = 'dsr-group';
    head.append(badge, group);

    const text = document.createElement('p');
    text.className = 'dsr-text';

    const actions = document.createElement('div');
    actions.className = 'dsr-actions';

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
      actions.append(button(locale.t('notice.gotUp'), {
        primary: true,
        onClick: () => { engine.standUp(); onAction?.('stand-up'); },
      }));
    }
    actions.append(button(locale.t('notice.snooze', { minutes: snoozeMinutes }), {
      primary: info.test === true,
      onClick: () => { engine.snooze(snoozeMinutes); onAction?.('snooze'); },
    }));
    actions.append(button(locale.t('notice.dismiss'), {
      onClick: () => { engine.dismiss(); onAction?.('dismiss'); },
    }));
  }

  function renderToast(snapshot) {
    const info = snapshot.notice;
    if (!info) {
      rendered = null;
      if (toast) { toast.remove(); toast = null; }
      if (rotate !== null) { clearTimeout(rotate); rotate = null; }
      return;
    }
    if (!toast) {
      toast = buildToast();
      root.append(toast);
    }
    const { badge, group, text } = toast.__parts;
    badge.textContent = locale.t(info.test ? 'notice.badgeTest' : 'notice.badge');
    group.textContent = info.group === 'custom' ? locale.t('group.custom') : locale.t(`group.${info.group}`);
    text.textContent = info.text;
    toast.dataset.test = String(info.test === true);
    // Rebuilding the buttons on every render would steal focus mid-click; the
    // wording only changes when the notice itself changes.
    const key = `${info.text}|${info.test}|${snapshot.settings.snoozeMinutes}|${locale.getLanguage()}`;
    if (rendered !== key) {
      rendered = key;
      paintActions(toast, snapshot);
    }
    // An auto-dismissing notice gets a one-off timer rather than a per-second one.
    if (rotate !== null) { clearTimeout(rotate); rotate = null; }
    if (info.expiresAt !== null && info.expiresAt !== undefined) {
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
      if (pill) { pill.remove(); pill = null; }
      return;
    }
    if (!pill) {
      pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'dsr-pill';
      const dot = document.createElement('span');
      dot.className = 'dsr-dot';
      const label = document.createElement('span');
      pill.append(dot, label);
      pill.__label = label;
      pill.addEventListener('click', () => onAction?.('open-settings'));
      root.append(pill);
    }
    const state = !snapshot.settings.enabled || snapshot.paused ? 'paused'
      : snapshot.due || snapshot.notice ? 'due' : 'next';
    pill.dataset.state = state;
    let next;
    if (state === 'due') next = locale.t('status.due');
    else if (snapshot.paused) next = locale.t('status.paused');
    else if (!snapshot.settings.enabled) next = locale.t('status.off');
    else next = locale.t('status.next', { duration: formatDuration(snapshot.remainingMs ?? 0, locale.t) });
    if (next !== pillText) {
      pillText = next;
      pill.__label.textContent = next;
    }
    pill.setAttribute('aria-label', next);
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
      root = document.createElement('div');
      root.id = ROOT_ID;
      const style = document.createElement('style');
      style.textContent = CSS;
      root.append(style);
      // The floating layer must live above the shell frame, not inside a column.
      document.body.append(root);
      element.style.display = '';
      unsubscribe = engine.subscribe(paint);
      stopLocale = locale.subscribe(() => { rendered = null; pillText = ''; paint(); });
      // The countdown needs a heartbeat of its own; the engine only emits on
      // real state changes.
      ticker = setInterval(() => { if (!document.hidden) paint(); }, 1000);
      ticker?.unref?.();
      paint();
    },
    stop() {
      if (ticker !== null) { clearInterval(ticker); ticker = null; }
      if (rotate !== null) { clearTimeout(rotate); rotate = null; }
      unsubscribe?.();
      stopLocale();
      unsubscribe = null;
      stopLocale = () => {};
      root?.remove();
      root = null;
      toast = null;
      pill = null;
      rendered = null;
      pillText = '';
      element.style.display = 'none';
    },
  };
}

export { GROUP_ORDER };
