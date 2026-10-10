/**
 * Optional OS-level notification and a soft chime.
 *
 * Both are best-effort: a denied permission, a missing Web Audio context or an
 * unsupported Notification constructor must degrade silently, never throw.
 */

/** Ask for notification permission, but only when the user opted in. */
export async function ensurePermission(scope = globalThis) {
  const Notification = scope?.Notification;
  if (typeof Notification !== 'function') return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return 'error';
  }
}

/**
 * Show one desktop notification. Returns true when it was actually shown.
 * @param {{ title: string, body: string, tag?: string }} input
 */
export function showSystemNotification({ title, body, tag = 'dsh-stand-reminder' }, scope = globalThis) {
  const Notification = scope?.Notification;
  if (typeof Notification !== 'function' || Notification.permission !== 'granted') return false;
  try {
    const notification = new Notification(title, { body, tag, silent: true });
    notification.onclick = () => {
      try {
        scope.focus?.();
        notification.close?.();
      } catch { /* focusing the window is optional */ }
    };
    return true;
  } catch {
    return false;
  }
}

/** A short two-tone chime, synthesised so the plugin ships no audio asset. */
export function playChime(scope = globalThis) {
  const Ctor = scope?.AudioContext ?? scope?.webkitAudioContext;
  if (typeof Ctor !== 'function') return false;
  try {
    const context = new Ctor();
    const start = context.currentTime;
    for (const [offset, frequency] of [[0, 660], [0.22, 880]]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.12, start + offset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.24);
    }
    setTimeout(() => { void context.close?.(); }, 900);
    return true;
  } catch {
    return false;
  }
}
