import { describe, expect, it } from 'vitest'
import { haversineKm } from './distance'

describe('haversineKm', () => {
  it('is zero for identical points', () => {
    expect(haversineKm({ lat: 40, lng: -73 }, { lat: 40, lng: -73 })).toBe(0)
  })

  it('matches a known city pair (Paris ↔ London ≈ 344 km)', () => {
    const paris = { lat: 48.8566, lng: 2.3522 }
    const london = { lat: 51.5074, lng: -0.1278 }
    expect(haversineKm(paris, london)).toBeCloseTo(344, 0)
  })

  it('is symmetric', () => {
    const a = { lat: 35.68, lng: 139.65 }
    const b = { lat: -33.87, lng: 151.21 }
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 6)
  })
})
