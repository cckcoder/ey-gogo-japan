<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import LanguageToggle from '../components/LanguageToggle.vue'
import { cardContent } from '../content'
import { dayCover } from '../covers'
import { formatDayDate } from '../format'
import { locale, t } from '../i18n'
import { renderCard } from '../markdown'
import { snapshot } from '../snapshot'

const props = defineProps<{ index: number }>()

const day = computed(() => snapshot.days.find((entry) => entry.index === props.index)!)
const hasCards = computed(() => day.value.cards.length > 0)
const cards = computed(() =>
  day.value.cards.map((card) => {
    const content = cardContent(card, locale.value)
    const mapLabel = locale.value === 'en' ? t('mapLink') : undefined
    return { id: card.id, title: content.title, html: renderCard(content.markdown, mapLabel) }
  }),
)
const title = computed(() => cards.value[0]?.title ?? t('noPlan'))
const cover = computed(() => dayCover(day.value))

// Days with cards, in order: the pills skip the empty Days between them.
const cardDays = snapshot.days.filter((entry) => entry.cards.length > 0).map((entry) => entry.index)
const previous = computed(() => [...cardDays].reverse().find((index) => index < props.index) ?? null)
const next = computed(() => cardDays.find((index) => index > props.index) ?? null)

// Keyboard on desktop: ← / → step through Days, Esc goes Home.
function onKeydown(event: KeyboardEvent): void {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (event.key === 'ArrowLeft' && previous.value !== null) {
    window.location.hash = `#/day/${previous.value}`
  } else if (event.key === 'ArrowRight' && next.value !== null) {
    window.location.hash = `#/day/${next.value}`
  } else if (event.key === 'Escape') {
    window.location.hash = '#/'
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <article class="min-h-screen bg-bg text-ink">
    <!-- Phone: full-bleed hero, floating title panel, sticky pills.
         Tablet: the same, inside a centred column with a rounded hero.
         Desktop: sticky photo on the left, the Day's plan on the right. -->
    <div
      class="mx-auto md:max-w-2xl md:px-8 md:pt-6 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14 lg:px-10 lg:pt-10"
    >
      <header
        class="hero-fade relative h-[44vh] min-h-[280px] overflow-hidden md:h-[420px] md:rounded-[28px] lg:sticky lg:top-10 lg:h-[min(720px,calc(100vh-5rem))]"
      >
        <img
          :src="cover"
          :alt="title"
          width="900"
          height="1125"
          class="h-full w-full object-cover"
        />
        <a
          href="#/"
          :aria-label="t('back')"
          class="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/30 text-xl text-white backdrop-blur-md transition-colors hover:bg-black/45"
        >←</a>
        <LanguageToggle on-photo class="absolute right-4 top-4" />
      </header>

      <div class="flex min-h-full flex-col lg:min-h-[min(720px,calc(100vh-5rem))]">
        <div class="relative z-10 -mt-10 px-4 md:px-6 lg:mt-0 lg:px-0">
          <div
            class="rounded-[20px] bg-bg p-5 shadow-float dark:border dark:border-line dark:shadow-none lg:rounded-none lg:p-0 lg:shadow-none lg:dark:border-0"
          >
            <p class="hidden text-[13px] font-semibold uppercase tracking-[0.16em] text-primary lg:block">
              {{ t('day') }} {{ day.index }}
            </p>
            <h1 class="text-[17px] font-semibold text-ink lg:mt-2 lg:text-[32px] lg:leading-tight">
              {{ title }}
            </h1>
            <div class="mt-2 flex items-center justify-between gap-3 lg:mt-3">
              <p class="text-[13px] text-muted lg:text-[15px]">
                <span class="lg:hidden">{{ t('day') }} {{ day.index }} · </span>{{ formatDayDate(day.date, locale) }}
              </p>
              <span
                v-if="day.destination"
                class="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
              >{{ day.destination }}</span>
            </div>
          </div>
        </div>

        <div v-if="hasCards" class="mt-6 flex-1 px-5 pb-8 md:px-7 lg:mt-8 lg:border-t lg:border-line lg:px-0 lg:pt-8">
          <section
            v-for="(card, i) in cards"
            :key="card.id"
            :class="i > 0 ? 'mt-8' : ''"
          >
            <h2 v-if="cards.length > 1" class="text-[17px] font-semibold text-ink">
              {{ card.title }}
            </h2>
            <div
              v-if="card.html"
              class="card-prose prose dark:prose-invert mt-3 break-words lg:text-base"
              v-html="card.html"
            ></div>
          </section>
        </div>
        <p v-else class="mt-6 flex-1 px-5 pb-8 text-[15px] text-muted md:px-7 lg:px-0">{{ t('noPlan') }}</p>

        <nav
          class="safe-bottom sticky bottom-0 z-20 flex items-center gap-3 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur-md lg:bottom-6 lg:rounded-full lg:border lg:px-3 lg:py-3 lg:shadow-float lg:dark:shadow-none"
          :aria-label="t('dayNavigation')"
        >
          <a
            v-if="previous !== null"
            :href="`#/day/${previous}`"
            class="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
          >← Day {{ previous }}</a>
          <span class="hidden flex-1 text-center text-xs text-muted lg:block" aria-hidden="true">{{ t('keyboardHint') }}</span>
          <a
            v-if="next !== null"
            :href="`#/day/${next}`"
            class="ml-auto rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-float transition-opacity hover:opacity-90 dark:shadow-none lg:ml-0"
          >Day {{ next }} →</a>
        </nav>
      </div>
    </div>
  </article>
</template>
