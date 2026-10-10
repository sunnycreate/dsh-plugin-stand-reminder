/**
 * Host half.
 *
 * The reminder is a pure UI concern: the countdown, the wording and the daily
 * counter all live in the browser, so this half deliberately creates no
 * service, no tool and no background timer. It only gives the bundle a
 * legitimate loader row (`cordis.patch.yml` inserts `dsh-plugin-stand-reminder`).
 */
export const name = 'standReminder';

export function apply() {
  // Intentionally empty — see the module comment.
}
