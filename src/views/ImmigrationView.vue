<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { t } from '../i18n'
import {
  formatPeriod,
  lengthLabel,
  formatRange,
  formatSheetDate,
  immigration,
  labels,
  lastDayInJapan,
  nightLabel,
  nights,
  nightsLabel,
  stayLength,
  todos,
} from '../immigration'
import { snapshot } from '../snapshot'

const PDF_TITLE = 'EY-Japan-Itinerary-2026'

// The time in Japan runs from the arrival flight to the departure flight, not the
// whole Trip (Day 8 is the landing in Bangkok).
const arrivalDate = immigration.flights.find((flight) => flight.direction === 'arrival')!.date
const departure = immigration.flights.find((flight) => flight.direction === 'departure')!
const period = formatPeriod(arrivalDate, lastDayInJapan(departure))
const length = lengthLabel(stayLength(immigration))
const missing = todos(immigration).length

const missingLine = computed(() => [t('missingBefore'), missing, t('missingAfter')].filter((part) => part !== '').join(' '))

// Days come from the Snapshot (dates, order), joined with the sheet's summaries by index.
const rows = snapshot.days.map((day) => ({
  date: day.date,
  summary: immigration.days.find((summary) => summary.index === day.index),
  night: nightLabel(immigration, day.date),
}))

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function savePdf(): void {
  window.print()
}

// The saved PDF takes its file name from the document title.
let screenTitle = ''
function onBeforePrint(): void {
  screenTitle = document.title
  document.title = PDF_TITLE
}
function onAfterPrint(): void {
  if (screenTitle) document.title = screenTitle
}

function onKeydown(event: KeyboardEvent): void {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (event.key === 'Escape') {
    window.location.hash = '#/'
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('beforeprint', onBeforePrint)
  window.removeEventListener('afterprint', onAfterPrint)
})
</script>

<template>
  <div class="min-h-screen bg-bg text-ink">
    <div class="mx-auto max-w-3xl px-5 pb-16 pt-5 md:px-8 md:pt-8 print:max-w-none print:p-0">
      <div class="print:hidden">
        <nav class="flex items-center justify-between gap-3" :aria-label="t('immigration')">
          <a
            href="#/"
            :aria-label="t('back')"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-xl text-ink transition-colors hover:text-primary"
          >←</a>
          <ThemeToggle />
        </nav>

        <div class="mt-6 md:flex md:items-center md:gap-4">
          <button
            type="button"
            class="w-full rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-on-primary shadow-float transition-transform active:scale-[0.98] motion-reduce:transition-none md:w-auto dark:border dark:border-line dark:shadow-none"
            @click="savePdf"
          >
            {{ t('savePdf') }}
          </button>
          <div class="mt-2 text-[13px] text-muted md:mt-0">
            <p v-if="missing > 0" class="font-medium text-ink">{{ missingLine }}</p>
            <p>{{ t('savePdfHint') }}</p>
          </div>
        </div>
      </div>

      <article
        class="mt-6 rounded-[20px] border border-line bg-bg p-5 text-[15px] leading-normal md:p-8 print:m-0 print:rounded-none print:border-0 print:p-0 print:text-[9pt]"
        lang="en"
      >
        <header>
          <h1 class="text-[1.6em] font-semibold leading-tight print:inline">{{ labels.title.en }}</h1>
          <p class="text-muted print:ml-3 print:inline print:text-[1.2em]" lang="ja">{{ labels.title.ja }}</p>
          <dl class="mt-4 print:mt-2 grid gap-x-8 gap-y-3 sm:grid-cols-3 print:grid-cols-3">
            <div>
              <dt class="text-[0.867em] text-muted">{{ labels.purpose.en }} <span lang="ja">{{ labels.purpose.ja }}</span></dt>
              <dd class="font-medium">{{ immigration.purpose.en }} <span lang="ja">{{ immigration.purpose.ja }}</span></dd>
            </div>
            <div>
              <dt class="text-[0.867em] text-muted">{{ labels.period.en }} <span lang="ja">{{ labels.period.ja }}</span></dt>
              <dd class="font-medium tabular-nums">{{ period }}</dd>
            </div>
            <div>
              <dt class="text-[0.867em] text-muted">{{ labels.length.en }} <span lang="ja">{{ labels.length.ja }}</span></dt>
              <dd class="font-medium tabular-nums">{{ length.en }} <span lang="ja">{{ length.ja }}</span></dd>
            </div>
          </dl>
        </header>

        <section class="mt-6 print:mt-3" aria-labelledby="flights-heading">
          <h2 id="flights-heading" class="text-[1.133em] font-semibold print:break-after-avoid">
            {{ labels.flights.en }} <span lang="ja" class="font-normal text-muted">{{ labels.flights.ja }}</span>
          </h2>
          <div
            v-for="flight in immigration.flights"
            :key="flight.direction"
            class="mt-2 grid grid-cols-[6.5em_1fr] gap-x-4 border-t border-line py-3 break-inside-avoid print:py-1"
          >
            <p>
              <span class="block font-medium">{{ labels[flight.direction].en }}</span>
              <span class="block text-[0.867em] text-muted" lang="ja">{{ labels[flight.direction].ja }}</span>
            </p>
            <div class="min-w-0">
              <p class="font-medium tabular-nums">
                {{ formatSheetDate(flight.date) }}<template v-if="flight.time"> · {{ flight.time }}</template><template v-if="flight.flight"> · {{ flight.flight }}</template>
              </p>
              <p class="print:inline">{{ flight.from.en }} → {{ flight.to.en }}</p>
              <p class="text-[0.867em] text-muted print:ml-2 print:inline" lang="ja">{{ flight.from.ja }} → {{ flight.to.ja }}</p>
              <p v-if="flight.todo" class="mt-2 rounded-xl border border-dashed border-muted px-3 py-2 print:mt-1 print:py-1 text-[0.867em] text-muted" lang="th">
                {{ t('toAdd') }} {{ flight.todo }}
              </p>
            </div>
          </div>
        </section>

        <section class="mt-6 print:mt-3" aria-labelledby="stays-heading">
          <h2 id="stays-heading" class="text-[1.133em] font-semibold print:break-after-avoid">
            {{ labels.stays.en }} <span lang="ja" class="font-normal text-muted">{{ labels.stays.ja }}</span>
          </h2>
          <div
            v-for="stay in immigration.stays"
            :key="stay.checkIn"
            class="mt-2 grid grid-cols-[6.5em_1fr] gap-x-4 border-t border-line py-3 break-inside-avoid print:py-1"
          >
            <p class="tabular-nums">
              <span class="block font-medium">{{ formatRange(stay.checkIn, stay.checkOut) }}</span>
              <span class="block text-[0.867em] text-muted">
                {{ nightsLabel(nights(stay)).en }} <span lang="ja">{{ nightsLabel(nights(stay)).ja }}</span>
              </span>
            </p>
            <div class="min-w-0">
              <div>
                <p class="font-semibold print:inline">{{ stay.name.en }}</p>
                <p class="print:ml-2 print:inline" lang="ja">{{ stay.name.ja }}</p>
              </div>
              <div>
                <p class="print:inline" lang="ja">{{ stay.address.ja }}</p>
                <p class="text-[0.867em] text-muted print:ml-2 print:inline">{{ stay.address.en }}</p>
              </div>
              <p class="text-[0.867em] tabular-nums">
                <a :href="telHref(stay.phone)" class="underline decoration-line underline-offset-2 print:no-underline">{{ stay.phone }}</a>
              </p>
              <p v-if="stay.todo" class="mt-2 rounded-xl border border-dashed border-muted px-3 py-2 print:mt-1 print:py-1 text-[0.867em] text-muted" lang="th">
                {{ t('toAdd') }} {{ stay.todo }}
              </p>
            </div>
          </div>
        </section>

        <section class="mt-6 print:mt-3" aria-labelledby="days-heading">
          <h2 id="days-heading" class="text-[1.133em] font-semibold print:break-after-avoid">
            {{ labels.dayByDay.en }} <span lang="ja" class="font-normal text-muted">{{ labels.dayByDay.ja }}</span>
          </h2>
          <table class="mt-2 w-full border-collapse text-left">
            <thead class="text-[0.867em] text-muted">
              <tr>
                <th scope="col" class="py-2 pr-3 font-normal">{{ labels.date.en }} <span lang="ja">{{ labels.date.ja }}</span></th>
                <th scope="col" class="py-2 pr-3 font-normal">{{ labels.plan.en }} <span lang="ja">{{ labels.plan.ja }}</span></th>
                <th scope="col" class="hidden py-2 font-normal sm:table-cell print:table-cell">{{ labels.stay.en }} <span lang="ja">{{ labels.stay.ja }}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.date" class="border-t border-line align-top break-inside-avoid">
                <th scope="row" class="whitespace-nowrap py-2 pr-3 print:py-0.5 font-medium tabular-nums">{{ formatSheetDate(row.date) }}</th>
                <td class="py-2 pr-3 print:py-0.5">
                  <span class="block">{{ row.summary?.en }}</span>
                  <span class="block text-[0.867em] text-muted" lang="ja">{{ row.summary?.ja }}</span>
                  <!-- Phone: the Stay sits under the plan, as the third column won't fit. -->
                  <span v-if="row.night" class="mt-1 block text-[0.867em] sm:hidden print:hidden">
                    {{ labels.stay.en }}: {{ row.night.en }} <span class="text-muted" lang="ja">{{ row.night.ja }}</span>
                  </span>
                </td>
                <td class="hidden py-2 print:whitespace-nowrap print:py-0.5 sm:table-cell print:table-cell">
                  <template v-if="row.night">
                    <span class="block print:inline">{{ row.night.en }}</span>
                    <span class="block text-[0.867em] text-muted print:ml-1.5 print:inline" lang="ja">{{ row.night.ja }}</span>
                  </template>
                  <span v-else class="text-muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer class="mt-6 print:mt-3 text-[0.8em] text-muted tabular-nums">
          {{ labels.prepared.en }} <span lang="ja">{{ labels.prepared.ja }}</span> {{ immigration.checkedAt }}
        </footer>
      </article>
    </div>
  </div>
</template>
