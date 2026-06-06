import { describe, expect, it } from 'vitest'
import { MAX_ROUND_SCORE, scoreForDistance } from './scoring'

describe('scoreForDistance', () => {
  it('awards the maximum for a perfect guess', () => {
    expect(scoreForDistance(0)).toBe(MAX_ROUND_SCORE)
  })

  it('decreases as distance grows', () => {
    expect(scoreForDistance(100)).toBeGreaterThan(scoreForDistance(1000))
    expect(scoreForDistance(1000)).toBeGreaterThan(scoreForDistance(5000))
  })

  it('approaches zero for very large distances', () => {
    expect(scoreForDistance(20000)).toBeLessThan(10)
  })

  it('never exceeds the maximum and is never negative', () => {
    const s = scoreForDistance(0)
    expect(s).toBeLessThanOrEqual(MAX_ROUND_SCORE)
    expect(scoreForDistance(50000)).toBeGreaterThanOrEqual(0)
  })

  it('treats invalid input as zero', () => {
    expect(scoreForDistance(-5)).toBe(0)
    expect(scoreForDistance(NaN)).toBe(0)
  })
})
