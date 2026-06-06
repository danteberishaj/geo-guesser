<script setup lang="ts">
import { useGameStore, ROUNDS_PER_GAME } from '../stores/game'

const store = useGameStore()
</script>

<template>
  <header class="hud">
    <span class="brand">🌍 Geo Guesser</span>
    <div class="stats">
      <span>Round <strong>{{ store.roundNumber }}</strong> / {{ ROUNDS_PER_GAME }}</span>
      <span>Score <strong>{{ store.totalScore.toLocaleString() }}</strong></span>
    </div>
  </header>
</template>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: var(--panel);
  border-bottom: 1px solid var(--panel-2);
  z-index: 500;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.02em;
}
.stats {
  display: flex;
  gap: 1.5rem;
  color: var(--muted);
}
.stats strong {
  color: var(--text);
}
</style>
