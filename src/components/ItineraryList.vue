<script setup lang="ts">
import { dayCover } from '../covers'
import { cardContent } from '../content'
import { formatDayShort } from '../format'
import { locale, t } from '../i18n'
import type { Day } from '../snapshot'

defineProps<{ days: Day[] }>()

function titleText(day: Day): string {
  return day.cards.length > 0
    ? day.cards.map((card) => cardContent(card, locale.value).title).join(' · ')
    : t('noPlan')
}
</script>

<template>
  <!-- Desktop reads as two columns, top to bottom, so Day order is kept. -->
  <ul class="mt-2 lg:columns-2 lg:gap-x-12">
    <li v-for="day in days" :key="day.index" class="break-inside-avoid">
      <a
        v-if="day.cards.length > 0"
        :href="`#/day/${day.index}`"
        class="group flex min-h-16 items-center gap-4 border-b border-line py-2 active:bg-surface"
      >
        <span class="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-surface">
          <img
            :src="dayCover(day)"
            alt=""
            width="112"
            height="112"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[15px] font-medium text-ink transition-colors group-hover:text-primary">{{ titleText(day) }}</span>
          <span class="mt-0.5 block text-[13px] text-muted">
            {{ t('day') }} {{ day.index }} · {{ formatDayShort(day.date, locale) }}
          </span>
        </span>
        <span class="text-muted transition-colors group-hover:text-primary" aria-hidden="true">→</span>
      </a>

      <div v-else class="flex min-h-16 items-center gap-4 border-b border-line py-2">
        <span
          class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface text-lg font-semibold text-muted"
          aria-hidden="true"
        >{{ day.index }}</span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[15px] text-muted">{{ titleText(day) }}</span>
          <span class="mt-0.5 block text-[13px] text-muted">
            {{ t('day') }} {{ day.index }} · {{ formatDayShort(day.date, locale) }}
          </span>
        </span>
      </div>
    </li>
  </ul>
</template>
