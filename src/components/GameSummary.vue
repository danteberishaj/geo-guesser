<script setup lang="ts">
import { useGameStore, ROUNDS_PER_GAME } from '../stores/game'
import { MAX_ROUND_SCORE } from '../utils/scoring'
import { formatDistance, ratingForTotal } from '../utils/format'
import { useCountUp } from '../composables/useCountUp'

const store = useGameStore()
const maxTotal = ROUNDS_PER_GAME * MAX_ROUND_SCORE
const total = store.totalScore
const animatedTotal = useCountUp(total)
const rating = ratingForTotal(total, maxTotal)

function pct(score: number | null): number {
  return Math.round(((score ?? 0) / MAX_ROUND_SCORE) * 100)
}

function playAgain() {
  store.resetGame()
  store.startGame()
}
</script>

<template>
  <div class="summary">
    <div class="card">
      <p class="rating">{{ rating }}</p>
      <p class="total">
        {{ animatedTotal.toLocaleString() }}
        <span>/ {{ maxTotal.toLocaleString() }}</span>
      </p>
      <ol class="rounds">
        <li v-for="(round, i) in store.rounds" :key="i">
          <span class="n">{{ i + 1 }}</span>
          <span class="bar">
            <span class="bar-fill" :style="{ width: pct(round.score) + '%' }" />
          </span>
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
  width: min(460px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
}
.rating {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent);
}
.total {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0.2rem 0 1.3rem;
  font-variant-numeric: tabular-nums;
}
.total span {
  font-size: 1.1rem;
  color: var(--muted);
  font-weight: 500;
}
.rounds {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  text-align: left;
}
.rounds li {
  display: grid;
  grid-template-columns: 1.2rem 1fr auto auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--panel-2);
}
.rounds .n {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.rounds .bar {
  height: 6px;
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
}
.rounds .bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
}
.rounds .muted {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.rounds strong {
  font-variant-numeric: tabular-nums;
  min-width: 3.2rem;
  text-align: right;
}
</style>
