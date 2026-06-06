<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { LatLng } from '../types/game'
import { addBaseTiles } from '../utils/mapTiles'

// Fix Leaflet's default marker icon paths under a bundler.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const emit = defineEmits<{ guess: [value: LatLng] }>()

const dockEl = ref<HTMLDivElement | null>(null)
const mapEl = ref<HTMLDivElement | null>(null)
const expanded = ref(false)
const pinned = ref(false)
const guess = ref<LatLng | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, {
    worldCopyJump: true,
    zoomControl: true,
    attributionControl: true,
  }).setView([20, 0], 1)
  addBaseTiles(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    guess.value = { lat: e.latlng.lat, lng: e.latlng.lng }
    if (marker) marker.setLatLng(e.latlng)
    else marker = L.marker(e.latlng).addTo(map!)
  })

  // Keep Leaflet's internal size in sync once the expand/collapse transition ends.
  dockEl.value?.addEventListener('transitionend', () => map?.invalidateSize())
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  map?.remove()
  map = null
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter') submit()
}

function setExpanded(value: boolean) {
  if (expanded.value === value) return
  expanded.value = value
  // Invalidate a few times across the transition so tiles fill smoothly.
  requestAnimationFrame(() => map?.invalidateSize())
  setTimeout(() => map?.invalidateSize(), 220)
}

function onEnter() {
  setExpanded(true)
}
function onLeave() {
  if (!pinned.value) setExpanded(false)
}
function togglePin() {
  pinned.value = !pinned.value
  setExpanded(pinned.value || expanded.value)
}

function submit() {
  if (guess.value) emit('guess', guess.value)
}
</script>

<template>
  <div
    ref="dockEl"
    class="guess-dock"
    :class="{ expanded }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div class="map-wrap">
      <div ref="mapEl" class="guess-map" />
      <button
        class="pin"
        type="button"
        :title="pinned ? 'Unpin map' : 'Pin map open'"
        @click="togglePin"
      >
        {{ pinned ? '📌' : '📍' }}
      </button>
    </div>
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
  width: 270px;
  height: 212px;
  /* Never taller than the play area (minus breathing room), so it can't slip
     under the HUD or push the guess button off-screen on short viewports. */
  max-height: calc(100% - 24px);
  background: var(--panel);
  padding: 6px;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transition: width 0.18s ease, height 0.18s ease;
}
.guess-dock.expanded {
  width: min(62vw, 740px);
  height: min(56vh, 460px);
}

.map-wrap {
  position: relative;
  flex: 1;
  min-height: 0; /* allow the map to shrink within the flex column */
}
.guess-map {
  height: 100%;
  border-radius: 6px;
}

.pin {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 500; /* above the Leaflet pane */
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 0.95rem;
  line-height: 1;
  background: var(--panel);
  color: var(--text);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}
.pin:hover:not(:disabled) {
  background: var(--panel-2);
}

.guess-btn {
  width: 100%;
  margin-top: 6px;
}
</style>
