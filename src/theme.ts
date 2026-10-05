import { ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark'

// The inline script in index.html reads the same key before first paint.
const STORAGE_KEY = 'gogo-theme'

const THEME_COLORS: Record<Theme, string> = { light: '#FFFFFF', dark: '#0E1116' }

/** The stored choice wins; with none, follow the system setting. */
export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return systemDark ? 'dark' : 'light'
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const systemQuery =
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null

/** The colour theme. Remembered per device once chosen; until then it follows the system. */
export const theme = ref<Theme>(resolveTheme(readStored(), systemQuery?.matches ?? false))

export function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit.
  }
}

// No stored choice yet: keep following the system when it switches.
systemQuery?.addEventListener('change', (event) => {
  if (readStored() === null) theme.value = event.matches ? 'dark' : 'light'
})

if (typeof document !== 'undefined') {
  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme.value])
  })
}
