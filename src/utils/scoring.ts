/** Maximum points awarded for a perfect (0 km) guess. */
export const MAX_ROUND_SCORE = 5000

/**
 * Distance (km) at which the score decays to 1/e (~37%) of the maximum.
 * Lower = harsher scoring. Tunable.
 */
const DECAY_KM = 2000

/**
 * Convert a guess distance (km) into a round score in the range 0..5000,
 * using exponential decay. A perfect guess scores MAX_ROUND_SCORE.
 */
export function scoreForDistance(km: number): number {
  if (!Number.isFinite(km) || km < 0) return 0
  return Math.round(MAX_ROUND_SCORE * Math.exp(-km / DECAY_KM))
}
