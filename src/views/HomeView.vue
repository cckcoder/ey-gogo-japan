<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import DayCarousel from '../components/DayCarousel.vue'
import HeroCollage from '../components/HeroCollage.vue'
import HomeTopBar from '../components/HomeTopBar.vue'
import LanguageToggle from '../components/LanguageToggle.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import ItineraryList from '../components/ItineraryList.vue'
import PhotoCredits from '../components/PhotoCredits.vue'
import { dayCover, fallbackSrc, heroSrc } from '../covers'
import { formatGeneratedAt } from '../format'
import { t } from '../i18n'
import { snapshot } from '../snapshot'
import { findTodayIndex } from '../today'
import { packingTotals, quantities } from '../packing'

// Module-level, so returning to Home from a Day restores where the traveller was.
let savedScroll = 0

const todayIndex = findTodayIndex(snapshot, new Date())
const cardDays = snapshot.days.filter((day) => day.cards.length > 0)

// Today's card first when the Trip is on.
const carouselDays = computed(() => {
  if (todayIndex === null) return cardDays
  const position = cardDays.findIndex((day) => day.index === todayIndex)
  if (position <= 0) return cardDays
  return [
    cardDays[position]!,
    ...cardDays.slice(0, position),
    ...cardDays.slice(position + 1),
  ]
})

const collageCovers = cardDays.slice(0, 2).map(dayCover)

const generatedAt = formatGeneratedAt(snapshot.generatedAt)

// The badge on the Packing List entry: items to pack with one wash.
const packingCount = packingTotals(quantities).wash

function scrollToItinerary(): void {
  document.getElementById('itinerary')?.scrollIntoView({ block: 'start' })
}

onMounted(() => {
  window.scrollTo(0, savedScroll)
})

onBeforeUnmount(() => {
  savedScroll = window.scrollY
})
</script>

<template>
  <div class="min-h-screen bg-bg text-ink">
    <div class="mx-auto max-w-6xl lg:px-10">
      <nav class="flex items-center justify-between px-5 pt-5 md:px-8 lg:px-0 lg:pt-8" aria-label="EY Gogo Japan">
        <span class="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-surface text-lg" aria-hidden="true">🇯🇵</span>
          Gogo Japan
        </span>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>

      <div class="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12 lg:pt-10">
        <HomeTopBar />
        <HeroCollage class="mt-5 lg:mt-0" :hero="heroSrc" :covers="collageCovers.length > 0 ? collageCovers : [fallbackSrc]" />
      </div>

      <section class="mt-8 md:mt-12 lg:mt-16" aria-labelledby="plan-by-day-heading">
        <div class="flex items-center justify-between px-5 md:px-8 lg:px-0">
          <h2 id="plan-by-day-heading" class="text-[17px] font-semibold text-ink md:text-xl">{{ t('planByDay') }}</h2>
          <button
            type="button"
            class="-mr-2 min-h-11 px-2 text-[15px] font-medium text-primary hover:underline"
            @click="scrollToItinerary"
          >{{ t('seeAll') }}</button>
        </div>
        <DayCarousel :days="carouselDays" :today-index="todayIndex" />
      </section>

      <section
        id="itinerary"
        class="mt-8 scroll-mt-4 px-5 md:mt-12 md:px-8 lg:mt-16 lg:px-0"
        aria-labelledby="itinerary-heading"
      >
        <h2 id="itinerary-heading" class="text-[17px] font-semibold text-ink md:text-xl">{{ t('itinerary') }}</h2>
        <ItineraryList :days="snapshot.days" />
      </section>

      <section class="mt-8 px-5 md:mt-12 md:px-8 lg:mt-16 lg:px-0" aria-labelledby="packing-heading">
        <a
          href="#/packing"
          class="group flex items-center gap-4 rounded-[20px] bg-primary-soft p-5 transition-transform active:scale-[0.98] motion-reduce:transition-none"
        >
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-semibold text-on-primary tabular-nums">
            {{ packingCount }}
          </span>
          <span class="min-w-0 flex-1">
            <span id="packing-heading" class="block text-[17px] font-semibold text-ink group-hover:text-primary">{{ t('packingTitle') }}</span>
            <span class="mt-0.5 block text-[13px] text-muted">{{ t('packingTeaser') }}</span>
          </span>
          <span class="text-primary" aria-hidden="true">→</span>
        </a>
      </section>

      <PhotoCredits :generated-at="generatedAt" />
    </div>
  </div>
</template>
