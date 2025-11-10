<template>
  <div class="progress-tracker">
    <div class="progress-header">
      <span class="progress-label">Round Progress</span>
      <span class="progress-count">{{ activeRoundIndex + 1 }} / {{ rounds.length }}</span>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progressPercentage}%` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useRaceStore from '@/store/race/composable'

const { completedRounds, rounds, activeRoundIndex } = useRaceStore()

const progressPercentage = computed(() => {
  const completed = completedRounds.value.length
  const total = rounds.value.length
  return total > 0 ? (completed / total) * 100 : 0
})
</script>

<style scoped>
.progress-tracker {
  @apply mt-4;
}

.progress-header {
  @apply flex items-center justify-between text-sm text-slate-400 mb-2;
}

.progress-bar {
  @apply w-full bg-slate-700 rounded-full h-2;
}

.progress-fill {
  @apply h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500;
}
</style>
