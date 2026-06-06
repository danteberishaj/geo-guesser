/** Human-friendly distance: metres under 1 km, otherwise km with one decimal. */
export function formatDistance(km: number | null): string {
  if (km == null) return '—'
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km).toLocaleString()} km`
}

/** A short, encouraging label for a single round score (0..5000). */
export function ratingForScore(score: number): string {
  if (score >= 4500) return 'Pinpoint!'
  if (score >= 3500) return 'Spot on'
  if (score >= 2000) return 'Not bad'
  if (score >= 750) return 'In the region'
  if (score > 0) return 'Wrong continent?'
  return 'Lost at sea'
}

/** A label for the final game total (0..maxTotal). */
export function ratingForTotal(total: number, maxTotal: number): string {
  const pct = maxTotal > 0 ? total / maxTotal : 0
  if (pct >= 0.9) return 'Globetrotter 🌍'
  if (pct >= 0.7) return 'Seasoned traveler ✈️'
  if (pct >= 0.5) return 'Map reader 🗺️'
  if (pct >= 0.3) return 'Getting your bearings 🧭'
  return 'Armchair explorer 🪑'
}
