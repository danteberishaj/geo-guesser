<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import type { Round } from '../types/game'
import { addBaseTiles } from '../utils/mapTiles'
import { formatDistance, ratingForScore } from '../utils/format'
import { MAX_ROUND_SCORE } from '../utils/scoring'
import { useCountUp } from '../composables/useCountUp'

const props = defineProps<{ round: Round; isLast: boolean }>()
const emit = defineEmits<{ next: [] }>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

const score = props.round.score ?? 0
const animatedScore = useCountUp(score)
const scorePct = computed(() => Math.round((score / MAX_ROUND_SCORE) * 100))
const rating = ratingForScore(score)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter') emit('next')
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (!mapEl.value || !props.round.guess) return
  const { guess, actual } = props.round

  map = L.map(mapEl.value, { attributionControl: true, zoomControl: false })
  addBaseTiles(map)

  const guessLatLng = L.latLng(guess.lat, guess.lng)
  const actualLatLng = L.latLng(actual.lat, actual.lng)

  L.circleMarker(guessLatLng, {
    radius: 7,
    color: '#0f172a',
    weight: 2,
    fillColor: '#2dd4bf',
    fillOpacity: 1,
  })
    .addTo(map)
    .bindTooltip('Your guess')
  L.circleMarker(actualLatLng, {
    radius: 7,
    color: '#0f172a',
    weight: 2,
    fillColor: '#f87171',
    fillOpacity: 1,
  })
    .addTo(map)
    .bindTooltip('Actual location')

  L.polyline([guessLatLng, actualLatLng], {
    color: '#2dd4bf',
    weight: 2,
    dashArray: '6 6',
  }).addTo(map)

  map.fitBounds(L.latLngBounds([guessLatLng, actualLatLng]).pad(0.4), {
    maxZoom: 6,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  map?.remove()
  map = null
})
</script>

<template>
  <div class="result">
    <div ref="mapEl" class="result-map" />
    <div class="result-card">
      <p class="rating">{{ rating }}</p>
      <h2>{{ animatedScore.toLocaleString() }} <span>points</span></h2>
      <div class="bar" role="img" :aria-label="`${score} of ${MAX_ROUND_SCORE} points`">
        <div class="bar-fill" :style="{ width: scorePct + '%' }" />
      </div>
      <p class="dist">
        You were
        <strong>{{ formatDistance(round.distanceKm) }}</strong>
        from the location.
      </p>
      <button type="button" @click="emit('next')">
        {{ isLast ? 'See final results' : 'Next round' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.result {
  position: relative;
  flex: 1;
  display: flex;
}
.result-map {
  flex: 1;
}
.result-card {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 600;
  background: var(--panel);
  padding: 1.1rem 1.5rem;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
  width: min(340px, calc(100vw - 32px));
}
.rating {
  margin: 0 0 0.15rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}
.result-card h2 {
  margin: 0 0 0.6rem;
  font-size: 2.2rem;
  font-variant-numeric: tabular-nums;
}
.result-card h2 span {
  font-size: 1rem;
  color: var(--muted);
  font-weight: 500;
}
.bar {
  height: 8px;
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
  margin-bottom: 0.85rem;
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.dist {
  margin: 0 0 1rem;
  color: var(--muted);
}
.dist strong {
  color: var(--text);
}
</style>
