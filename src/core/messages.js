/**
 * Built-in reminder wording.
 *
 * These are used when the user has not supplied custom text. They live in one
 * place so the scheduler, the settings preview and the tests all agree.
 */

/** @typedef {{ group: string, text: string }} ReminderMessage */

export const GROUP_ORDER = Object.freeze(['move', 'eyes', 'posture', 'habit']);

/** @type {Record<string, readonly ReminderMessage[]>} */
export const DEFAULT_MESSAGES = Object.freeze({
  zh: Object.freeze([
    // 走动 / 活动 — 直接给出可执行的动作
    Object.freeze({ group: 'move', text: '坐满一段时间了，站起来走两步吧，哪怕只到窗边打个转。' }),
    Object.freeze({ group: 'move', text: '起来动一动：接杯水，顺便把肩和脖子转一圈。' }),
    Object.freeze({ group: 'move', text: '别看屏幕了，先站起来。走到最远的那个角落再回来。' }),
    Object.freeze({ group: 'move', text: '给身体两分钟：伸个懒腰，活动一下脚踝和膝盖。' }),
    Object.freeze({ group: 'move', text: '站起来，双手举过头顶伸展三次，然后慢慢放下。' }),
    Object.freeze({ group: 'move', text: '该换个姿势了。起身走三十步，让血液跑一圈。' }),
    Object.freeze({ group: 'move', text: '久坐提醒：现在站起来，走一走，两分钟后再回来。' }),
    Object.freeze({ group: 'move', text: '把椅子推远一点，站起来。你需要的是走动，不是换个坐姿。' }),

    // 眼睛 — 20-20-20 法则
    Object.freeze({ group: 'eyes', text: '让眼睛下班二十秒，看看六米外的东西。' }),
    Object.freeze({ group: 'eyes', text: '站起来，望向窗外最远的地方，慢慢眨眼几次。' }),
    Object.freeze({ group: 'eyes', text: '眼睛也需要活动：远眺二十秒，再回来继续。' }),

    // 体态 — 局部放松
    Object.freeze({ group: 'posture', text: '肩膀是不是又耸起来了？站起来放松，再坐回去。' }),
    Object.freeze({ group: 'posture', text: '下巴收一点，肩往后打开，然后站起来活动一下腰。' }),
    Object.freeze({ group: 'posture', text: '手腕转一转，手指张开再握紧，然后起身走走。' }),
    Object.freeze({ group: 'posture', text: '腰背有没有发紧？站起来后仰伸展一下再回来。' }),

    // 习惯 — 轻推一把
    Object.freeze({ group: 'habit', text: '注意坐姿：别跷腿，双脚放平。再站起来动一动。' }),
    Object.freeze({ group: 'habit', text: '离屏幕远一点，站起来动一动，你会更清醒。' }),
    Object.freeze({ group: 'habit', text: '这一轮的久坐到此为止，站起来给身体一点时间。' }),
    Object.freeze({ group: 'habit', text: '起来吧，就当是帮下一段工作攒一点专注力。' }),
  ]),

  en: Object.freeze([
    Object.freeze({ group: 'move', text: 'You have been sitting a while — stand up and take a few steps, even just to the window.' }),
    Object.freeze({ group: 'move', text: 'Time to move: grab some water and roll your shoulders and neck on the way.' }),
    Object.freeze({ group: 'move', text: 'Look away from the screen and stand up. Walk to the far corner and back.' }),
    Object.freeze({ group: 'move', text: 'Give your body two minutes: stretch, then circle your ankles and knees.' }),
    Object.freeze({ group: 'move', text: 'Stand up, reach both hands overhead three times, then lower them slowly.' }),
    Object.freeze({ group: 'move', text: 'Change position. Take thirty steps and get the blood moving.' }),
    Object.freeze({ group: 'move', text: 'Sitting reminder: stand up and walk for two minutes, then come back.' }),
    Object.freeze({ group: 'move', text: 'Push the chair back and stand. You need to walk, not just shift position.' }),

    Object.freeze({ group: 'eyes', text: 'Give your eyes twenty seconds off — look at something twenty feet away.' }),
    Object.freeze({ group: 'eyes', text: 'Stand up and look at the furthest thing outside. Blink slowly a few times.' }),
    Object.freeze({ group: 'eyes', text: 'Your eyes need a break too: gaze into the distance for twenty seconds.' }),

    Object.freeze({ group: 'posture', text: 'Shoulders creeping up again? Stand, let them drop, then sit back down.' }),
    Object.freeze({ group: 'posture', text: 'Chin in, shoulders back — then stand up and loosen your lower back.' }),
    Object.freeze({ group: 'posture', text: 'Roll your wrists, spread and close your fingers, then get up and walk.' }),
    Object.freeze({ group: 'posture', text: 'Is your back tightening? Stand up, lean back and stretch before returning.' }),

    Object.freeze({ group: 'habit', text: 'Check your posture: no crossed legs, feet flat. Then stand and move.' }),
    Object.freeze({ group: 'habit', text: 'Move back from the screen, stand up and walk — you will think more clearly.' }),
    Object.freeze({ group: 'habit', text: 'That is enough sitting for this stretch. Stand up and give your body a moment.' }),
    Object.freeze({ group: 'habit', text: 'Get up — think of it as banking focus for the next round of work.' }),
  ]),
});

/** Normalize an arbitrary language tag to a supported message language. */
export function messageLanguage(language) {
  return typeof language === 'string' && /^zh(?:$|[-_])/i.test(language.trim()) ? 'zh' : 'en';
}

/**
 * Flatten the built-in pool for one language.
 * @param {string} language
 * @returns {ReminderMessage[]}
 */
export function builtInMessages(language) {
  return DEFAULT_MESSAGES[messageLanguage(language)].map(message => ({ ...message }));
}
