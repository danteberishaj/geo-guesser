import type { LatLng } from '../types/game'
import { LOCATIONS, type BBox } from '../data/locations'

const GRAPH_URL = 'https://graph.mapillary.com/images'
const TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN

export interface Panorama {
  imageId: string
  actual: LatLng
}

/** Thrown when VITE_MAPILLARY_TOKEN is not configured. The UI shows a setup hint. */
export class MissingTokenError extends Error {
  constructor() {
    super('VITE_MAPILLARY_TOKEN is not set')
    this.name = 'MissingTokenError'
  }
}

/** Thrown when no panorama could be found after exhausting retries. */
export class NoImageryError extends Error {
  constructor() {
    super('Could not find street-level imagery. Please try again.')
    this.name = 'NoImageryError'
  }
}

export function hasToken(): boolean {
  return typeof TOKEN === 'string' && TOKEN.length > 0
}

interface MapillaryImage {
  id: string
  computed_geometry?: { type: 'Point'; coordinates: [number, number] }
  geometry?: { type: 'Point'; coordinates: [number, number] }
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function coordsOf(img: MapillaryImage): LatLng | null {
  const point = img.computed_geometry ?? img.geometry
  if (!point) return null
  const [lng, lat] = point.coordinates
  return { lat, lng }
}

async function queryBBox(box: BBox): Promise<MapillaryImage[]> {
  const [minLng, minLat, maxLng, maxLat] = box.bbox
  const params = new URLSearchParams({
    access_token: TOKEN,
    fields: 'id,computed_geometry,geometry',
    bbox: `${minLng},${minLat},${maxLng},${maxLat}`,
    limit: '50',
  })
  const res = await fetch(`${GRAPH_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Mapillary request failed: ${res.status} ${res.statusText}`)
  }
  const json = (await res.json()) as { data?: MapillaryImage[] }
  return json.data ?? []
}

/**
 * Fetch a single random panorama: pick a random city bbox, query Mapillary,
 * and return a random image with coordinates. Retries other boxes on empty
 * results (coverage gaps). Throws MissingTokenError / NoImageryError.
 */
export async function fetchRandomPanorama(maxAttempts = 6): Promise<Panorama> {
  if (!hasToken()) throw new MissingTokenError()

  const tried = new Set<string>()
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let box = pickRandom(LOCATIONS)
    // Prefer an untried box so retries actually explore new areas.
    if (tried.has(box.name) && tried.size < LOCATIONS.length) {
      box = LOCATIONS.find((b) => !tried.has(b.name)) ?? box
    }
    tried.add(box.name)

    let images: MapillaryImage[]
    try {
      images = await queryBBox(box)
    } catch {
      continue
    }

    const withCoords = images.filter((img) => coordsOf(img) !== null)
    if (withCoords.length === 0) continue

    const chosen = pickRandom(withCoords)
    const actual = coordsOf(chosen)!
    return { imageId: chosen.id, actual }
  }

  throw new NoImageryError()
}

/** Fetch several distinct panoramas for a game's rounds. */
export async function fetchPanoramas(count: number): Promise<Panorama[]> {
  const results: Panorama[] = []
  const seen = new Set<string>()
  // Fetch sequentially-ish but allow a few parallel; keep it simple and reliable.
  const raw = await Promise.all(
    Array.from({ length: count }, () => fetchRandomPanorama()),
  )
  for (const pano of raw) {
    if (!seen.has(pano.imageId)) {
      seen.add(pano.imageId)
      results.push(pano)
    }
  }
  // If duplicates collapsed the list, top it up.
  while (results.length < count) {
    const extra = await fetchRandomPanorama()
    if (!seen.has(extra.imageId)) {
      seen.add(extra.imageId)
      results.push(extra)
    }
  }
  return results
}
