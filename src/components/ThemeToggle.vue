<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../i18n'
import { theme, toggleTheme } from '../theme'

defineProps<{ onPhoto?: boolean }>()

const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <!-- One round button beside the language toggle. It shows where a tap leads:
       a moon in light mode, a sun in dark mode. -->
  <button
    type="button"
    :aria-label="t('darkMode')"
    :aria-pressed="isDark"
    class="relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors"
    :class="onPhoto ? 'bg-black/30 text-white backdrop-blur-md hover:bg-black/45' : 'bg-surface text-ink hover:text-primary'"
    @click="toggleTheme"
  >
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="theme-icon absolute"
      :class="isDark ? 'theme-icon-off' : ''"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      aria-hidden="true"
      class="theme-icon absolute"
      :class="isDark ? '' : 'theme-icon-off'"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  </button>
</template>

<style scoped>
.theme-icon {
  transition:
    opacity 200ms ease-out,
    transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.theme-icon-off {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

@media (prefers-reduced-motion: reduce) {
  .theme-icon {
    transition: none;
  }
}
</style>
