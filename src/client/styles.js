/**
 * Shared control styles, injected once per module instance.
 *
 * Scoped under `.dsh-sr` so nothing here can leak into the host UI. Every
 * colour is a DSH theme token, so light/dark follow the app automatically.
 */
export const SETTINGS_CSS = `
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
