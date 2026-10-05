import { onUnmounted, ref, type Ref } from 'vue'
import { snapshot } from './snapshot'

export type Route = { name: 'home' } | { name: 'day'; index: number }

const DAY_HASH = /^#\/day\/(\d+)$/

/**
 * Pure hash parser. `#/day/:index` is a Day route only when the index matches a
 * real Day in the Snapshot; anything else (empty, unknown, out of range) is Home.
 */
export function parseRoute(hash: string): Route {
  const match = DAY_HASH.exec(hash)
  if (!match) return { name: 'home' }

  const index = Number(match[1])
  const day = snapshot.days.find((candidate) => candidate.index === index)
  if (!day) return { name: 'home' }

  return { name: 'day', index }
}

/** Reactive route that follows `hashchange`, starting from the current hash. */
export function useRoute(): Ref<Route> {
  const route = ref<Route>(parseRoute(window.location.hash))

  const onHashChange = () => {
    route.value = parseRoute(window.location.hash)
  }

  window.addEventListener('hashchange', onHashChange)
  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
  })

  return route
}
