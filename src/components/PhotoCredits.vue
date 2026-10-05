<script setup lang="ts">
import { credits } from '../covers'
import { t } from '../i18n'

defineProps<{ generatedAt: string }>()

// Commons file titles end in their extension; the credit reads better without it.
function photoTitle(title: string): string {
  return title.replace(/\.(jpe?g|png|webp)$/i, '')
}
</script>

<template>
  <footer class="mt-12 border-t border-line px-5 py-6 md:px-8 lg:px-0">
    <p class="text-[13px] text-muted">{{ t('updatedAt') }} {{ generatedAt }}</p>
    <details class="mt-3 text-[13px] text-muted">
      <summary class="cursor-pointer font-medium text-ink">{{ t('photoCredits') }}</summary>
      <ul class="mt-3 space-y-2">
        <li v-for="credit in credits" :key="credit.file">
          “{{ photoTitle(credit.title) }}” {{ t('by') }} {{ credit.artist }}, {{ credit.license }} ·
          <a
            :href="credit.source"
            target="_blank"
            rel="noopener"
            class="text-primary hover:underline"
          >{{ t('source') }} ↗</a>
        </li>
      </ul>
    </details>
  </footer>
</template>
