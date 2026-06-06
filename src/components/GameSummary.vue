<script setup lang="ts">
import { useGameStore, ROUNDS_PER_GAME } from '../stores/game'
import { MAX_ROUND_SCORE } from '../utils/scoring'

const store = useGameStore()
const maxTotal = ROUNDS_PER_GAME * MAX_ROUND_SCORE

function formatDistance(km: number | null): string {
  if (km == null) return '—'
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

function playAgain() {
  store.resetGame()
  store.startGame()
}
</script>

<template>
  <div class="summary">
    <div class="card">
      <h1>Game over</h1>
      <p class="total">
        {{ store.totalScore.toLocaleString() }}
        <span>/ {{ maxTotal.toLocaleString() }}</span>
      </p>
      <ol class="rounds">
        <li v-for="(round, i) in store.rounds" :key="i">
          <span>Round {{ i + 1 }}</span>
          <span class="muted">{{ formatDistance(round.distanceKm) }}</span>
          <strong>{{ (round.score ?? 0).toLocaleString() }}</strong>
        </li>
      </ol>
      <button type="button" @click="playAgain">Play again</button>
    </div>
  </div>
</template>

<style scoped>
.summary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.card {
  background: var(--panel);
  padding: 2rem 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  width: min(440px, 100%);
}
h1 {
  margin: 0 0 0.5rem;
}
.total {
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 1.2rem;
}
.total span {
  font-size: 1.1rem;
  color: var(--muted);
  font-weight: 500;
}
.rounds {
  list-style: none;
  margin: 0 0 1.4rem;
  padding: 0;
  text-align: left;
}
.rounds li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--panel-2);
}
.rounds .muted {
  color: var(--muted);
}
</style>
