import { defineStore } from 'pinia'
import type { GameStatus, LatLng, Round } from '../types/game'
import { haversineKm } from '../utils/distance'
import { scoreForDistance } from '../utils/scoring'
import {
  fetchPanoramas,
  hasToken,
  MissingTokenError,
} from '../services/mapillary'

export const ROUNDS_PER_GAME = 5

interface GameState {
  status: GameStatus
  rounds: Round[]
  currentIndex: number
  error: string | null
  /** True when the failure is specifically a missing Mapillary token. */
  needsToken: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    status: 'idle',
    rounds: [],
    currentIndex: 0,
    error: null,
    needsToken: false,
  }),

  getters: {
    currentRound(state): Round | null {
      return state.rounds[state.currentIndex] ?? null
    },
    roundNumber(state): number {
      return state.currentIndex + 1
    },
    totalScore(state): number {
      return state.rounds.reduce((sum, r) => sum + (r.score ?? 0), 0)
    },
    isLastRound(state): boolean {
      return state.currentIndex >= state.rounds.length - 1
    },
    hasGuessed(): boolean {
      return this.currentRound?.guess != null
    },
  },

  actions: {
    async startGame() {
      this.status = 'loading'
      this.error = null
      this.needsToken = false
      this.rounds = []
      this.currentIndex = 0

      if (!hasToken()) {
        this.needsToken = true
        this.error = 'Set VITE_MAPILLARY_TOKEN in a .env file to play.'
        this.status = 'idle'
        return
      }

      try {
        const panoramas = await fetchPanoramas(ROUNDS_PER_GAME)
        this.rounds = panoramas.map((p) => ({
          imageId: p.imageId,
          actual: p.actual,
          guess: null,
          distanceKm: null,
          score: null,
        }))
        this.status = 'playing'
      } catch (err) {
        if (err instanceof MissingTokenError) {
          this.needsToken = true
          this.error = 'Set VITE_MAPILLARY_TOKEN in a .env file to play.'
        } else {
          this.error =
            err instanceof Error ? err.message : 'Failed to load imagery.'
        }
        this.status = 'idle'
      }
    },

    submitGuess(guess: LatLng) {
      const round = this.rounds[this.currentIndex]
      if (!round || this.status !== 'playing') return
      round.guess = guess
      round.distanceKm = haversineKm(guess, round.actual)
      round.score = scoreForDistance(round.distanceKm)
      this.status = 'revealed'
    },

    nextRound() {
      if (this.status !== 'revealed') return
      if (this.isLastRound) {
        this.status = 'finished'
      } else {
        this.currentIndex += 1
        this.status = 'playing'
      }
    },

    resetGame() {
      this.status = 'idle'
      this.rounds = []
      this.currentIndex = 0
      this.error = null
      this.needsToken = false
    },
  },
})
