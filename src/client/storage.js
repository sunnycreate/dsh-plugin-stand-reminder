/**
 * localStorage adapter.
 *
 * Storage failures (private mode, disabled storage, quota) must never take the
 * reminder down, so every access is guarded and simply degrades to in-memory.
 */
export function createLocalStorageAdapter(scope = globalThis) {
  const memory = new Map();
  let backing = null;
  try {
    backing = scope.localStorage ?? null;
    // Probe once: a present-but-throwing localStorage is a real case.
    backing?.getItem('dsh-plugin-stand-reminder:probe');
  } catch {
    backing = null;
  }
  return {
    get(key) {
      try {
        if (backing) return backing.getItem(key);
      } catch { /* fall through to memory */ }
      return memory.has(key) ? memory.get(key) : null;
    },
    set(key, value) {
      memory.set(key, value);
      try {
        backing?.setItem(key, value);
      } catch { /* in-memory value still serves this page */ }
    },
  };
}
