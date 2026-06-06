<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Viewer } from 'mapillary-js'

const props = defineProps<{ imageId: string }>()

const container = ref<HTMLDivElement | null>(null)
const loading = ref(true)
let viewer: Viewer | null = null

const token = import.meta.env.VITE_MAPILLARY_TOKEN

onMounted(() => {
  if (!container.value) return
  viewer = new Viewer({
    accessToken: token,
    container: container.value,
    imageId: props.imageId,
    component: { cover: false },
  })
  // Hide the loading veil once the first panorama has actually rendered.
  viewer.on('image', () => {
    loading.value = false
  })
})

watch(
  () => props.imageId,
  (id) => {
    if (viewer && id) {
      loading.value = true
      viewer.moveTo(id).catch(() => {
        /* image may be unavailable; the next round will replace it */
      })
    }
  },
)

onBeforeUnmount(() => {
  viewer?.remove()
  viewer = null
})
</script>

<template>
  <div class="street-view">
    <div
      ref="container"
      class="viewer"
      role="application"
      aria-label="Street view — drag to look around and explore"
    />
    <Transition name="veil">
      <div v-if="loading" class="veil">
        <div class="spinner" />
        <p>Loading the view…</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.street-view {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #000;
}
.viewer {
  position: absolute;
  inset: 0;
}
.veil {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: var(--bg);
  color: var(--muted);
  z-index: 10;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid var(--panel-2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.veil-leave-active {
  transition: opacity 0.4s ease;
}
.veil-leave-to {
  opacity: 0;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
