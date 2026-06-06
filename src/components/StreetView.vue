<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Viewer } from 'mapillary-js'

const props = defineProps<{ imageId: string }>()

const container = ref<HTMLDivElement | null>(null)
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
})

watch(
  () => props.imageId,
  (id) => {
    if (viewer && id) {
      viewer.moveTo(id).catch(() => {
        /* image may be unavailable; ignore navigation errors */
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
  <div ref="container" class="street-view" />
</template>

<style scoped>
.street-view {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #000;
}
</style>
