import { onBeforeUnmount, ref, type Ref } from 'vue'

/**
 * Animate a number from 0 up to `target` over `duration` ms using an ease-out
 * curve. Returns a reactive ref holding the current (rounded) value. Respects
 * the user's reduced-motion preference by snapping straight to the target.
 */
export function useCountUp(target: number, duration = 900): Ref<number> {
  const value = ref(0)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduced || target <= 0) {
    value.value = target
    return value
  }

  let raf = 0
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    value.value = Math.round(target * eased)
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  onBeforeUnmount(() => cancelAnimationFrame(raf))
  return value
}
