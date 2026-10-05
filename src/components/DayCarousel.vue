<script setup lang="ts">
import { dayCover } from '../covers'
import { cardContent } from '../content'
import { formatDayShort } from '../format'
import { locale, t } from '../i18n'
import type { Day } from '../snapshot'

defineProps<{ days: Day[]; todayIndex: number | null }>()
</script>

<template>
  <!-- Phone: a snapping carousel. Tablet and up: a grid, no sideways scrolling. -->
  <ul
    class="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 pt-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-8 lg:gap-6 lg:px-0"
    aria-label="Plan by Day"
  >
    <li
      v-for="(day, i) in days"
      :key="day.index"
      class="w-[78vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
    >
      <a
        :href="`#/day/${day.index}`"
        class="group relative block aspect-[4/5] overflow-hidden rounded-[28px] transition-transform active:scale-[0.98]"
      >
        <img
          :src="dayCover(day)"
          :alt="day.cards[0] ? cardContent(day.cards[0], locale).title : ''"
          width="780"
          height="975"
          :loading="i === 0 ? 'eager' : 'lazy'"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          v-if="todayIndex === day.index"
          class="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
        >{{ t('today') }}</span>
        <div
          class="absolute inset-x-3 bottom-3 rounded-[20px] bg-white/85 p-4 backdrop-blur-md dark:bg-surface/85"
        >
          <p class="truncate text-[17px] font-semibold text-ink">
            {{ day.cards[0] ? cardContent(day.cards[0], locale).title : '' }}
          </p>
          <p class="mt-1 text-[13px] text-muted">
            {{ t('day') }} {{ day.index }} · {{ formatDayShort(day.date, locale) }}
          </p>
        </div>
      </a>
    </li>
  </ul>
</template>
