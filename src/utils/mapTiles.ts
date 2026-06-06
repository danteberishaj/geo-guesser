import L from 'leaflet'

/**
 * Dark basemap tiles (CARTO) that match the app's dark theme, with a light
 * "labels only" overlay kept legible. Shared by the guess map and result map
 * so both look consistent.
 */
const DARK_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const TILE_OPTIONS: L.TileLayerOptions = {
  maxZoom: 19,
  subdomains: 'abcd',
  attribution: '© OpenStreetMap contributors, © CARTO',
}

/** Add the shared dark tile layer to a Leaflet map and return it. */
export function addBaseTiles(map: L.Map): L.TileLayer {
  return L.tileLayer(DARK_TILE_URL, TILE_OPTIONS).addTo(map)
}
