<script setup lang="ts">
import { useGameStore } from './stores/game'
import GameHud from './components/GameHud.vue'
import StreetView from './components/StreetView.vue'
import GuessMap from './components/GuessMap.vue'
import RoundResult from './components/RoundResult.vue'
import GameSummary from './components/GameSummary.vue'
import type { LatLng } from './types/game'

const store = useGameStore()

function onGuess(value: LatLng) {
  store.submitGuess(value)
}
</script>

<template>
  <GameHud
    v-if="store.status === 'playing' || store.status === 'revealed'"
  />

  <!-- Start screen -->
  <main v-if="store.status === 'idle'" class="screen center">
    <div class="card">
      <h1>🌍 Geo Guesser</h1>
      <p>
        You'll be dropped into a random street somewhere in the world. Explore
        the view, then drop a pin on the map to guess where you are. Five rounds,
        closest guess wins.
      </p>
      <p v-if="store.error" class="error">{{ store.error }}</p>
      <p v-if="store.needsToken" class="hint">
        Create a free token at
        <a href="https://www.mapillary.com/dashboard/developers" target="_blank"
          >mapillary.com</a
        >
        and add <code>VITE_MAPILLARY_TOKEN</code> to a <code>.env</code> file.
      </p>
      <button type="button" @click="store.startGame()">Play</button>
    </div>
  </main>

  <!-- Loading -->
  <main v-else-if="store.status === 'loading'" class="screen center">
    <div class="card">
      <div class="spinner" />
      <p>Finding somewhere in the world…</p>
    </div>
  </main>

  <!-- Playing -->
  <main
    v-else-if="store.status === 'playing' && store.currentRound"
    class="screen play"
  >
    <StreetView :image-id="store.currentRound.imageId" />
    <GuessMap @guess="onGuess" />
  </main>

  <!-- Round result -->
  <RoundResult
    v-else-if="store.status === 'revealed' && store.currentRound"
    :round="store.currentRound"
    :is-last="store.isLastRound"
    @next="store.nextRound()"
  />

  <!-- Final summary -->
  <GameSummary v-else-if="store.status === 'finished'" />
</template>

<style scoped>
.screen {
  flex: 1;
  position: relative;
  display: flex;
}
.center {
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.play {
  overflow: hidden;
}
.card {
  background: var(--panel);
  padding: 2rem 2.5rem;
  border-radius: 16px;
  text-align: center;
  width: min(520px, 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}
.card h1 {
  margin-top: 0;
}
.card p {
  color: var(--muted);
  line-height: 1.5;
}
.error {
  color: var(--danger) !important;
}
.hint code {
  background: var(--panel-2);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}
.spinner {
  width: 38px;
  height: 38px;
  margin: 0 auto 1rem;
  border: 4px solid var(--panel-2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
