<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import type { Round } from '../types/game'

const props = defineProps<{ round: Round; isLast: boolean }>()
const emit = defineEmits<{ next: [] }>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapEl.value || !props.round.guess) return
  const { guess, actual } = props.round

  map = L.map(mapEl.value, { attributionControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)

  const guessLatLng = L.latLng(guess.lat, guess.lng)
  const actualLatLng = L.latLng(actual.lat, actual.lng)

  L.marker(guessLatLng).addTo(map).bindTooltip('Your guess')
  L.circleMarker(actualLatLng, {
    radius: 8,
    color: '#f87171',
    fillColor: '#f87171',
    fillOpacity: 0.9,
  })
    .addTo(map)
    .bindTooltip('Actual location')

  L.polyline([guessLatLng, actualLatLng], {
    color: '#2dd4bf',
    dashArray: '6 6',
  }).addTo(map)

  map.fitBounds(L.latLngBounds([guessLatLng, actualLatLng]).pad(0.4))
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}
</script>

<template>
  <div class="result">
    <div ref="mapEl" class="result-map" />
    <div class="result-card">
      <h2>{{ round.score?.toLocaleString() }} <span>points</span></h2>
      <p class="dist">
        You were
        <strong>{{ formatDistance(round.distanceKm ?? 0) }}</strong>
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
  padding: 1rem 1.4rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  min-width: 280px;
}
.result-card h2 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  color: var(--accent);
}
.result-card h2 span {
  font-size: 1rem;
  color: var(--muted);
  font-weight: 500;
}
.dist {
  margin: 0 0 0.9rem;
  color: var(--muted);
}
.dist strong {
  color: var(--text);
}
</style>
