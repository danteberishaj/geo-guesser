<script setup lang="ts">
import { useGameStore, ROUNDS_PER_GAME } from '../stores/game'

const store = useGameStore()
</script>

<template>
  <header class="hud">
    <span class="brand">🌍 Geo Guesser</span>

    <ol class="progress" :aria-label="`Round ${store.roundNumber} of ${ROUNDS_PER_GAME}`">
      <li
        v-for="(round, i) in store.rounds"
        :key="i"
        class="dot"
        :class="{
          done: round.score != null,
          active: i === store.currentIndex,
        }"
      />
    </ol>

    <div class="stats">
      <span class="round">Round <strong>{{ store.roundNumber }}</strong> / {{ ROUNDS_PER_GAME }}</span>
      <span>Score <strong>{{ store.totalScore.toLocaleString() }}</strong></span>
    </div>
  </header>
</template>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 1rem;
  background: var(--panel);
  border-bottom: 1px solid var(--panel-2);
  z-index: 500;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.progress {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--panel-2);
  transition: background 0.2s ease, transform 0.2s ease;
}
.dot.done {
  background: var(--accent);
}
.dot.active {
  transform: scale(1.35);
  box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2);
}
.stats {
  display: flex;
  gap: 1.5rem;
  color: var(--muted);
  white-space: nowrap;
}
.stats strong {
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
@media (max-width: 520px) {
  .stats .round {
    display: none;
  }
}
</style>
