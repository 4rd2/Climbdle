export const HINT_AFTER_ATTEMPTS = 3;

export function canRevealHint(state) {
  return state?.solved === false && Array.isArray(state.guesses) && state.guesses.length >= HINT_AFTER_ATTEMPTS;
}

// Separate each day's hint from guest/account progress and other users' hints.
export function hintKey(day, userId) {
  return `climbdle:hint:${userId || 'guest'}:${day}`;
}
