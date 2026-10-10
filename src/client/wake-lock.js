/**
 * Optional Screen Wake Lock.
 *
 * A reminder that arrives while the display is asleep is useless, so an opt-in
 * setting keeps the screen awake. The browser drops the lock whenever the page
 * is hidden, so it is re-acquired on the way back.
 */

/**
 * @param {boolean} enabled
 * @param {object} [scope]
 * @returns {() => void} idempotent release
 */
export function createWakeLock(enabled, scope = globalThis) {
  const sentinel = scope?.navigator?.wakeLock;
  if (!enabled || typeof sentinel?.request !== 'function') return () => {};

  let lock = null;
  let released = false;

  const acquire = async () => {
    if (released || lock !== null) return;
    try {
      const next = await sentinel.request('screen');
      // The request may settle after a release or after visibility was lost.
      if (released || scope.document?.hidden === true) {
        void next.release?.().catch?.(() => {});
        return;
      }
      lock = next;
      next.addEventListener?.('release', () => { lock = null; });
    } catch { /* a denied wake lock never breaks the reminder */ }
  };

  const onVisibility = () => {
    if (scope.document?.hidden === false) void acquire();
  };
  scope.document?.addEventListener?.('visibilitychange', onVisibility);
  void acquire();

  return () => {
    if (released) return;
    released = true;
    scope.document?.removeEventListener?.('visibilitychange', onVisibility);
    const current = lock;
    lock = null;
    try { void current?.release?.(); } catch { /* already released by the browser */ }
  };
}
