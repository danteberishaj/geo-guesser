/**
 * Curated bounding boxes over cities with dense Mapillary coverage.
 * Each round picks one at random, then queries Mapillary for a panorama inside it.
 *
 * A bbox is [minLng, minLat, maxLng, maxLat]. Boxes are kept fairly tight around
 * city centres so results are recognizable rather than empty rural roads.
 */
export interface BBox {
  name: string
  bbox: [number, number, number, number]
}

export const LOCATIONS: BBox[] = [
  { name: 'New York, USA', bbox: [-74.02, 40.7, -73.95, 40.78] },
  { name: 'San Francisco, USA', bbox: [-122.45, 37.74, -122.39, 37.8] },
  { name: 'Chicago, USA', bbox: [-87.68, 41.86, -87.6, 41.92] },
  { name: 'Toronto, Canada', bbox: [-79.41, 43.63, -79.36, 43.68] },
  { name: 'Mexico City, Mexico', bbox: [-99.18, 19.41, -99.12, 19.45] },
  { name: 'London, UK', bbox: [-0.16, 51.49, -0.07, 51.53] },
  { name: 'Paris, France', bbox: [2.31, 48.84, 2.37, 48.88] },
  { name: 'Amsterdam, Netherlands', bbox: [4.87, 52.35, 4.92, 52.38] },
  { name: 'Berlin, Germany', bbox: [13.36, 52.5, 13.43, 52.53] },
  { name: 'Madrid, Spain', bbox: [-3.72, 40.4, -3.66, 40.43] },
  { name: 'Rome, Italy', bbox: [12.46, 41.88, 12.52, 41.91] },
  { name: 'Lisbon, Portugal', bbox: [-9.16, 38.7, -9.12, 38.73] },
  { name: 'Stockholm, Sweden', bbox: [18.04, 59.31, 18.1, 59.34] },
  { name: 'Helsinki, Finland', bbox: [24.92, 60.16, 24.97, 60.18] },
  { name: 'Vienna, Austria', bbox: [16.35, 48.19, 16.39, 48.22] },
  { name: 'Prague, Czechia', bbox: [14.4, 50.07, 14.45, 50.1] },
  { name: 'Athens, Greece', bbox: [23.71, 37.96, 23.75, 37.99] },
  { name: 'Istanbul, Turkey', bbox: [28.96, 41.0, 29.02, 41.04] },
  { name: 'Tokyo, Japan', bbox: [139.69, 35.66, 139.74, 35.7] },
  { name: 'Singapore', bbox: [103.83, 1.28, 103.87, 1.31] },
  { name: 'Bangkok, Thailand', bbox: [100.49, 13.72, 100.54, 13.76] },
  { name: 'Sydney, Australia', bbox: [151.19, -33.88, 151.23, -33.85] },
  { name: 'Melbourne, Australia', bbox: [144.95, -37.82, 144.99, -37.8] },
  { name: 'Auckland, New Zealand', bbox: [174.74, -36.86, 174.78, -36.84] },
  { name: 'Cape Town, South Africa', bbox: [18.4, -33.93, 18.45, -33.9] },
  { name: 'Buenos Aires, Argentina', bbox: [-58.42, -34.62, -58.37, -34.58] },
  { name: 'São Paulo, Brazil', bbox: [-46.66, -23.57, -46.62, -23.54] },
  { name: 'Rio de Janeiro, Brazil', bbox: [-43.21, -22.92, -43.16, -22.89] },
]
