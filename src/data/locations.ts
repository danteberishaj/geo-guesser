/**
 * Curated centre points over cities with dense Mapillary coverage.
 * Each round picks one at random; the service fetches the Mapillary coverage
 * vector tile (zoom 14) covering that point and selects a random panorama
 * inside it. Points are city centres so results are recognizable.
 */
export interface Place {
  name: string
  lat: number
  lng: number
}

export const LOCATIONS: Place[] = [
  { name: 'New York, USA', lat: 40.7411, lng: -73.9897 },
  { name: 'San Francisco, USA', lat: 37.7793, lng: -122.4192 },
  { name: 'Chicago, USA', lat: 41.8819, lng: -87.6278 },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Amsterdam, Netherlands', lat: 52.3702, lng: 4.8952 },
  { name: 'Berlin, Germany', lat: 52.52, lng: 13.405 },
  { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686 },
  { name: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384 },
  { name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738 },
  { name: 'Prague, Czechia', lat: 50.0755, lng: 14.4378 },
  { name: 'Athens, Greece', lat: 37.9838, lng: 23.7275 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631 },
  { name: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633 },
  { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
  { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
]
