<script setup lang="ts">
import { locale, setLocale, t, type Locale } from '../i18n'

defineProps<{ onPhoto?: boolean }>()

const options: { value: Locale; label: string; name: string }[] = [
  { value: 'th', label: 'ไทย', name: 'ภาษาไทย' },
  { value: 'en', label: 'EN', name: 'English' },
]
</script>

<template>
  <div
    role="group"
    :aria-label="t('language')"
    class="inline-flex shrink-0 rounded-full p-1"
    :class="onPhoto ? 'bg-black/30 backdrop-blur-md' : 'bg-surface'"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :lang="option.value"
      :aria-pressed="locale === option.value"
      :aria-label="option.name"
      class="min-h-9 min-w-11 rounded-full px-3 text-[13px] font-semibold transition-colors"
      :class="
        locale === option.value
          ? 'bg-primary text-white shadow-float dark:shadow-none'
          : onPhoto
            ? 'text-white/85 hover:text-white'
            : 'text-muted hover:text-ink'
      "
      @click="setLocale(option.value)"
    >{{ option.label }}</button>
  </div>
</template>
