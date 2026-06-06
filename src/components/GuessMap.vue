<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { LatLng } from '../types/game'

// Fix Leaflet's default marker icon paths under a bundler.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const emit = defineEmits<{ guess: [value: LatLng] }>()

const mapEl = ref<HTMLDivElement | null>(null)
const expanded = ref(false)
const guess = ref<LatLng | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, { worldCopyJump: true, attributionControl: true }).setView(
    [20, 0],
    1,
  )
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    const value = { lat: e.latlng.lat, lng: e.latlng.lng }
    guess.value = value
    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map!)
    }
  })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

function toggle() {
  expanded.value = !expanded.value
  // Leaflet must recompute its size after the container resizes.
  requestAnimationFrame(() => map?.invalidateSize())
}

function submit() {
  if (guess.value) emit('guess', guess.value)
}
</script>

<template>
  <div class="guess-dock" :class="{ expanded }">
    <button class="toggle secondary" type="button" @click="toggle">
      {{ expanded ? 'Shrink' : 'Expand' }} map
    </button>
    <div ref="mapEl" class="guess-map" />
    <button class="guess-btn" type="button" :disabled="!guess" @click="submit">
      {{ guess ? 'Make guess' : 'Click the map to guess' }}
    </button>
  </div>
</template>

<style scoped>
.guess-dock {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 600;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 320px;
  background: var(--panel);
  padding: 6px;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transition: width 0.18s ease;
}
.guess-dock.expanded {
  width: min(60vw, 720px);
}
.guess-map {
  height: 200px;
  border-radius: 6px;
  transition: height 0.18s ease;
}
.guess-dock.expanded .guess-map {
  height: min(60vh, 520px);
}
.toggle {
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  align-self: flex-end;
}
.guess-btn {
  width: 100%;
}
</style>
