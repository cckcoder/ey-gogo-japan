<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LanguageToggle from '../components/LanguageToggle.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { formatDayDate } from '../format'
import { locale, t } from '../i18n'
import {
  checklists,
  dayTips,
  kit,
  KIT_PRICES_CHECKED,
  kitTotal,
  layers,
  packingTotals,
  pick,
  quantities,
  readChecked,
  saveChecked,
  weather,
  WEATHER_SCALE,
  type Checklist,
  type Unit,
} from '../packing'

const totals = packingTotals(quantities)
const kitSum = kitTotal(kit)
const checked = ref(readChecked())

const allChecklistIds = checklists.flatMap((list) => list.items.map((item) => item.id))
const tickedTotal = computed(() => allChecklistIds.filter((id) => checked.value.has(id)).length)

const span = WEATHER_SCALE.max - WEATHER_SCALE.min
function barStyle(low: number, high: number): Record<string, string> {
  return {
    left: `${((low - WEATHER_SCALE.min) / span) * 100}%`,
    width: `${((high - low) / span) * 100}%`,
  }
}

function barWidth(value: number, total: number): Record<string, string> {
  return { width: total === 0 ? '0%' : `${(value / total) * 100}%` }
}

function count(value: number, unit: Unit): string {
  return unit === 'pair' ? `${value} ${t('pairs')}` : String(value)
}

function baht(value: number): string {
  return `฿${value.toLocaleString('en-US')}`
}

function toggle(id: string): void {
  const next = new Set(checked.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  checked.value = next
  saveChecked(next)
}

function itemIds(list: Checklist): string[] {
  return list.items.map((item) => item.id)
}

function done(ids: string[]): number {
  return ids.filter((id) => checked.value.has(id)).length
}

function progress(ids: string[]): string {
  return `${done(ids)}/${ids.length}`
}

// Desktop keyboard on par with a Day: Esc goes Home. No modifier chords.
function onKeydown(event: KeyboardEvent): void {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (event.key === 'Escape') {
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
  <div class="min-h-screen bg-bg text-ink">
    <div class="mx-auto max-w-3xl px-5 pb-16 pt-5 md:px-8 md:pt-8">
      <nav class="flex items-center justify-between gap-3" :aria-label="t('packing')">
        <a
          href="#/"
          :aria-label="t('back')"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-xl text-ink transition-colors hover:text-primary"
        >←</a>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>

      <header class="mt-6">
        <h1 class="text-[28px] font-semibold leading-tight md:text-[40px]">{{ t('packingTitleLead')
          }}<span class="text-primary">{{ t('packingTitleAccent') }}</span></h1>
        <p class="mt-2 text-[15px] text-muted">{{ t('packingTeaser') }}</p>
      </header>

      <!-- Weather -->
      <section class="mt-10" aria-labelledby="weather-heading">
        <h2 id="weather-heading" class="text-[17px] font-semibold md:text-xl">{{ t('weather') }}</h2>
        <p class="mt-1 text-[13px] text-muted">{{ t('weatherNote') }}</p>
        <ul class="mt-4 grid gap-3 sm:grid-cols-3">
          <li v-for="place in weather" :key="place.days" class="grid gap-2 rounded-[20px] bg-surface p-4">
            <div>
              <p class="text-[15px] font-semibold">{{ pick(place.name, locale) }}</p>
              <p class="text-[13px] text-muted">{{ place.days }}</p>
            </div>
            <p class="flex items-baseline gap-1 tabular-nums">
              <span class="text-[28px] font-semibold">{{ place.low }}–{{ place.high }}</span>
              <span class="text-muted">°C</span>
            </p>
            <div class="relative h-1.5 rounded-full bg-line" aria-hidden="true">
              <span class="absolute inset-y-0 rounded-full bg-primary" :style="barStyle(place.low, place.high)"></span>
            </div>
            <p class="text-[13px] leading-normal text-muted">{{ pick(place.note, locale) }}</p>
          </li>
        </ul>
      </section>

      <!-- Layering -->
      <section class="mt-10" aria-labelledby="layers-heading">
        <h2 id="layers-heading" class="text-[17px] font-semibold md:text-xl">{{ t('layering') }}</h2>
        <p class="mt-1 text-[13px] text-muted">{{ t('layeringNote') }}</p>
        <dl class="mt-3 border-t border-line">
          <div
            v-for="layer in layers"
            :key="layer.name.en"
            class="grid gap-1 border-b border-line py-3 sm:grid-cols-[96px_1fr] sm:gap-4"
          >
            <dt class="text-[13px] font-semibold text-primary">{{ pick(layer.name, locale) }}</dt>
            <dd class="text-[15px]">{{ pick(layer.text, locale) }}</dd>
          </div>
        </dl>
      </section>

      <!-- How many -->
      <section class="mt-10" aria-labelledby="qty-heading">
        <h2 id="qty-heading" class="text-[17px] font-semibold md:text-xl">{{ t('howMany') }}</h2>
        <p class="mt-1 text-[13px] text-muted">{{ t('howManyNote') }}</p>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <p class="grid rounded-[20px] bg-primary-soft px-4 py-3">
            <span class="text-[28px] font-semibold leading-tight text-primary tabular-nums">{{ totals.wash }}</span>
            <span class="text-[13px]">{{ t('itemsWashOnce') }}</span>
          </p>
          <p class="grid rounded-[20px] bg-surface px-4 py-3">
            <span class="text-[28px] font-semibold leading-tight tabular-nums">{{ totals.noWash }}</span>
            <span class="text-[13px] text-muted">{{ t('itemsNoWash') }}</span>
          </p>
        </div>

        <div class="mt-4 overflow-x-auto rounded-[20px] border border-line">
          <table class="w-full border-collapse text-[14px]">
            <thead>
              <tr class="text-left text-[12px] text-muted">
                <th scope="col" class="px-4 py-2.5 font-semibold">{{ t('item') }}</th>
                <th scope="col" class="w-px whitespace-nowrap px-3 py-2.5 text-right font-semibold">{{ t('washOnce') }}</th>
                <th scope="col" class="w-px whitespace-nowrap px-4 py-2.5 text-right font-semibold">{{ t('noWash') }}</th>
              </tr>
            </thead>
            <tbody v-for="group in quantities" :key="group.name.en">
              <tr>
                <th colspan="3" scope="rowgroup" class="bg-surface px-4 py-1.5 text-left text-[12px] font-semibold text-primary">
                  {{ pick(group.name, locale) }}
                </th>
              </tr>
              <tr v-for="item in group.items" :key="item.name.en" class="border-t border-line align-top">
                <td class="px-4 py-2.5">
                  {{ pick(item.name, locale) }}
                  <span v-if="item.note" class="block text-[13px] text-muted">{{ pick(item.note, locale) }}</span>
                </td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums">{{ count(item.wash, item.unit) }}</td>
                <td class="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-muted">{{ count(item.noWash, item.unit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Day by Day -->
      <section class="mt-10" aria-labelledby="days-heading">
        <h2 id="days-heading" class="text-[17px] font-semibold md:text-xl">{{ t('byDay') }}</h2>
        <ul class="mt-3 border-t border-line">
          <li
            v-for="tip in dayTips"
            :key="tip.days"
            class="grid gap-2 border-b border-line py-3 sm:grid-cols-[72px_1fr] sm:items-start sm:gap-3"
          >
            <span class="slot justify-self-start min-w-[72px] text-center">{{ tip.days }}</span>
            <p class="text-[15px] leading-[1.7]">{{ pick(tip.text, locale) }}</p>
          </li>
        </ul>
      </section>

      <!-- Checklist -->
      <section class="mt-10" aria-labelledby="check-heading">
        <div class="flex items-baseline justify-between gap-3">
          <h2 id="check-heading" class="text-[17px] font-semibold md:text-xl">{{ t('checklist') }}</h2>
          <span class="text-[13px] font-medium text-muted tabular-nums" aria-hidden="true">{{ progress(allChecklistIds) }}</span>
        </div>
        <p class="mt-1 text-[13px] text-muted">{{ t('checklistNote') }}</p>
        <div
          class="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          :aria-valuenow="tickedTotal"
          aria-valuemin="0"
          :aria-valuemax="allChecklistIds.length"
          :aria-valuetext="progress(allChecklistIds)"
          :aria-label="t('checklist')"
        >
          <span
            class="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
            :style="barWidth(tickedTotal, allChecklistIds.length)"
          ></span>
        </div>

        <div class="mt-6 grid gap-8 md:grid-cols-2">
          <div v-for="list in checklists" :key="list.title.en">
            <div class="flex items-baseline justify-between gap-2">
              <h3 class="text-[15px] font-semibold">{{ pick(list.title, locale) }}</h3>
              <span
                class="text-[12px] font-medium tabular-nums"
                :class="done(itemIds(list)) === list.items.length ? 'text-primary' : 'text-muted'"
                aria-hidden="true"
              >{{ progress(itemIds(list)) }}</span>
            </div>
            <div
              class="mt-2 h-1 overflow-hidden rounded-full bg-line"
              role="progressbar"
              :aria-valuenow="done(itemIds(list))"
              aria-valuemin="0"
              :aria-valuemax="list.items.length"
              :aria-valuetext="progress(itemIds(list))"
              :aria-label="pick(list.title, locale)"
            >
              <span
                class="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                :style="barWidth(done(itemIds(list)), list.items.length)"
              ></span>
            </div>
            <ul class="mt-1">
              <li v-for="item in list.items" :key="item.id" class="border-b border-line">
                <label class="flex min-h-11 cursor-pointer items-start gap-3 py-2.5">
                  <input
                    type="checkbox"
                    class="check mt-0.5"
                    :checked="checked.has(item.id)"
                    @change="toggle(item.id)"
                  />
                  <span class="min-w-0">
                    <span
                      class="block text-[15px] font-medium"
                      :class="checked.has(item.id) ? 'text-muted line-through' : ''"
                    >{{ pick(item.label, locale) }}</span>
                    <span v-if="item.note" class="block text-[13px] leading-normal text-muted">{{ pick(item.note, locale) }}</span>
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Decathlon kit -->
      <section class="mt-10" aria-labelledby="kit-heading">
        <h2 id="kit-heading" class="text-[17px] font-semibold md:text-xl">{{ t('kit') }}</h2>
        <p class="mt-1 text-[13px] text-muted">
          {{ t('kitNote') }} {{ formatDayDate(KIT_PRICES_CHECKED, locale) }}. {{ t('kitNoteEnd') }}
        </p>
        <ul class="mt-3 border-t border-line">
          <li v-for="item in kit" :key="item.url">
            <a
              :href="item.url"
              target="_blank"
              rel="noopener"
              class="group flex min-h-16 items-center gap-4 border-b border-line py-3"
            >
              <span class="min-w-0 flex-1">
                <span class="block text-[13px] font-semibold text-primary">{{ pick(item.layer, locale) }}</span>
                <span class="block text-[15px] font-medium transition-colors group-hover:text-primary">{{ item.name }} <span aria-hidden="true">↗</span><span class="sr-only"> ({{ t('opensInNewTab') }})</span></span>
                <span class="block text-[13px] text-muted">{{ pick(item.why, locale) }}</span>
              </span>
              <span class="shrink-0 text-right tabular-nums">
                <span class="block font-semibold">{{ baht(item.price) }}</span>
                <s v-if="item.oldPrice" class="block text-[12px] text-muted">{{ baht(item.oldPrice) }}</s>
              </span>
            </a>
          </li>
        </ul>
        <p class="mt-3 flex items-baseline justify-between gap-3 rounded-[20px] bg-primary-soft px-4 py-3 text-[15px]">
          <span class="font-semibold">{{ t('kitTotal') }} · {{ kit.length }} {{ t('pieces') }}</span>
          <span class="text-xl font-semibold text-primary tabular-nums">{{ baht(kitSum) }}</span>
        </p>
      </section>
    </div>
  </div>
</template>
