// CampusVibe — Cred (reputation) point system

/**
 * Points awarded for each action type.
 */
export const CRED_ACTIONS = {
  post_global: 5,
  post_college: 8,
  review: 15,
  receive_like: 2,
  receive_helpful: 5,
  daily_login: 3,
  win_game: 20,
  complete_profile: 25,
  first_post: 10,
  get_10_followers: 30,
};

/**
 * Level tiers based on cred score.
 * The last level has no upper bound (max = Infinity).
 */
export const LEVELS = [
  { min: 0, max: 50, name: 'Fresher', emoji: '\u{1F331}' },
  { min: 51, max: 150, name: 'Regular', emoji: '\u{1F392}' },
  { min: 151, max: 300, name: 'Popular', emoji: '\u{1F31F}' },
  { min: 301, max: 500, name: 'Campus Icon', emoji: '\u{1F525}' },
  { min: 501, max: 800, name: 'Legend', emoji: '\u{1F451}' },
  { min: 801, max: Infinity, name: 'Campus God', emoji: '\u{26A1}' },
];

/**
 * Returns the level object that corresponds to the given cred score.
 *
 * @param {number} credScore
 * @returns {{ min: number, max: number, name: string, emoji: string }}
 */
export function getLevel(credScore) {
  return (
    LEVELS.find((level) => credScore >= level.min && credScore <= level.max) ||
    LEVELS[0]
  );
}

/**
 * Calculates the new cred score after performing an action.
 *
 * @param {number} currentScore - The user's current cred score
 * @param {string} action - The action key (must exist in CRED_ACTIONS)
 * @returns {number} The updated cred score
 */
export function addCred(currentScore, action) {
  const points = CRED_ACTIONS[action] || 0;
  return currentScore + points;
}
