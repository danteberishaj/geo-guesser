import { VectorTile } from '@mapbox/vector-tile'
import Pbf from 'pbf'
import type { LatLng } from '../types/game'
import { LOCATIONS, type Place } from '../data/locations'

const TILE_URL = 'https://tiles.mapillary.com/maps/vtp/mly1_public/2'
const TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN
/** Zoom level whose tiles expose the per-image coverage layer. */
const ZOOM = 14

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

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/** Slippy-map tile x/y containing a lng/lat at the given zoom. */
function lngLatToTile(lng: number, lat: number, z: number): { x: number; y: number } {
  const n = 2 ** z
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n)
  return { x, y }
}

interface Candidate {
  id: string
  lng: number
  lat: number
}

/**
 * Fetch the coverage tile for a place and return its image candidates,
 * preferring 360° panoramas. Returns [] on a coverage gap or failure.
 */
async function tileCandidates(place: Place): Promise<Candidate[]> {
  const { x, y } = lngLatToTile(place.lng, place.lat, ZOOM)
  const url = `${TILE_URL}/${ZOOM}/${x}/${y}?access_token=${encodeURIComponent(TOKEN)}`

  let buf: ArrayBuffer
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    buf = await res.arrayBuffer()
  } catch {
    return []
  }

  // pbf v4's Pbf and @mapbox/vector-tile's expected PbfReader differ only in
  // their type declarations; they are runtime-compatible.
  const pbf = new Pbf(new Uint8Array(buf)) as unknown as ConstructorParameters<
    typeof VectorTile
  >[0]
  const tile = new VectorTile(pbf)
  const layer = tile.layers['image']
  if (!layer || layer.length === 0) return []

  // Sample random feature indices rather than decoding all (a tile can hold
  // tens of thousands). Collect a handful, preferring panoramas.
  const panos: Candidate[] = []
  const flat: Candidate[] = []
  const samples = Math.min(layer.length, 60)
  const seen = new Set<number>()
  for (let i = 0; i < samples * 2 && panos.length < 12; i++) {
    const idx = Math.floor(Math.random() * layer.length)
    if (seen.has(idx)) continue
    seen.add(idx)
    const feat = layer.feature(idx)
    const geom = feat.toGeoJSON(x, y, ZOOM).geometry
    if (geom.type !== 'Point') continue
    const [lng, lat] = geom.coordinates as [number, number]
    const cand: Candidate = { id: String(feat.properties.id), lng, lat }
    if (feat.properties.is_pano) panos.push(cand)
    else flat.push(cand)
  }
  return panos.length > 0 ? panos : flat
}

/**
 * Fetch a single random panorama: pick a random city, read its Mapillary
 * coverage tile, and return a random image. Retries other cities on coverage
 * gaps. Throws MissingTokenError / NoImageryError.
 */
export async function fetchRandomPanorama(maxAttempts = 6): Promise<Panorama> {
  if (!hasToken()) throw new MissingTokenError()

  const tried = new Set<string>()
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let place = pickRandom(LOCATIONS)
    if (tried.has(place.name) && tried.size < LOCATIONS.length) {
      place = LOCATIONS.find((p) => !tried.has(p.name)) ?? place
    }
    tried.add(place.name)

    const candidates = await tileCandidates(place)
    if (candidates.length === 0) continue

    const chosen = pickRandom(candidates)
    return { imageId: chosen.id, actual: { lat: chosen.lat, lng: chosen.lng } }
  }

  throw new NoImageryError()
}

/** Fetch several distinct panoramas for a game's rounds. */
export async function fetchPanoramas(count: number): Promise<Panorama[]> {
  const results: Panorama[] = []
  const seen = new Set<string>()
  const raw = await Promise.all(
    Array.from({ length: count }, () => fetchRandomPanorama()),
  )
  for (const pano of raw) {
    if (!seen.has(pano.imageId)) {
      seen.add(pano.imageId)
      results.push(pano)
    }
  }
  while (results.length < count) {
    const extra = await fetchRandomPanorama()
    if (!seen.has(extra.imageId)) {
      seen.add(extra.imageId)
      results.push(extra)
    }
  }
  return results
}
