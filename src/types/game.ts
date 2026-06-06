export interface LatLng {
  lat: number
  lng: number
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'revealed' | 'finished'

export interface Round {
  /** Mapillary image id shown in the street-level viewer. */
  imageId: string
  /** True coordinates of the panorama. Hidden from the UI until revealed. */
  actual: LatLng
  /** Where the player dropped their pin. Null until they guess. */
  guess: LatLng | null
  /** Great-circle distance between guess and actual, in km. Null until guessed. */
  distanceKm: number | null
  /** Round score, 0..5000. Null until guessed. */
  score: number | null
}
