<script setup lang="ts">
import { computed } from 'vue'
import { formatTripRange } from '../format'
import { locale } from '../i18n'
import { snapshot } from '../snapshot'

const tripRange = computed(() =>
  formatTripRange(
    snapshot.days.map((day) => day.date),
    locale.value,
  ),
)
</script>

<template>
  <header class="px-5 pt-4 md:px-8 md:pt-6 lg:px-0 lg:pt-0">
    <h1 class="text-[28px] font-semibold leading-tight text-ink md:text-[40px] lg:text-[56px] lg:leading-[1.05]">
      Japan<br /><span class="text-primary">Trip</span> 2026
    </h1>
    <p class="mt-1 text-[13px] text-muted md:mt-3 md:text-[15px]">{{ tripRange }}</p>
  </header>
</template>
