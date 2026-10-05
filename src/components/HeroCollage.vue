<script setup lang="ts">
defineProps<{ hero: string; covers: string[] }>()
</script>

<template>
  <!-- Purely decorative: the same photos appear as named content below.
       Phone: a capsule beside two stacked tiles. Tablet and up: three tall
       columns, so the tiles never stretch into thin strips. -->
  <div class="flex h-[228px] gap-3 px-5 md:h-[280px] md:px-8 lg:h-[340px] lg:px-0" aria-hidden="true">
    <div class="w-[128px] shrink-0 overflow-hidden rounded-full md:w-[150px] lg:w-[170px]">
      <img :src="hero" alt="" width="340" height="680" class="h-full w-full object-cover" />
    </div>
    <div class="grid flex-1 grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-1 md:gap-3">
      <div
        v-for="(cover, i) in covers"
        :key="i"
        class="overflow-hidden rounded-[28px]"
      >
        <img :src="cover" alt="" width="440" height="440" class="h-full w-full object-cover" />
      </div>
    </div>
  </div>
</template>
