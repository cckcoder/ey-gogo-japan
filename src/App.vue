<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from './route'
import DayView from './views/DayView.vue'
import HomeView from './views/HomeView.vue'

const route = useRoute()
const dayIndex = computed(() => (route.value.name === 'day' ? route.value.index : null))
</script>

<template>
  <HomeView v-if="route.name === 'home'" />
  <DayView v-else-if="dayIndex !== null" :key="dayIndex" :index="dayIndex" />
</template>
