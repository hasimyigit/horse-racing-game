<template>
  <div class="racing-lane">
    <div class="lane-info">
      <span class="lane-number">Lane {{ laneNumber }}</span>
    </div>

    <div class="track-area">
      <RacerComponent :progress="progress" :color="horse.color" :name="horse.name" />

      <div v-if="finished" class="finish-badge">
        <div class="finish-content">
          <span class="finish-icon">🏁</span>
          <span class="finish-text">Finished</span>
        </div>
      </div>
    </div>

    <div class="horse-name">
      {{ horse.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '@/types'
import RacerComponent from './RacerComponent.vue'

interface Props {
  laneNumber: number
  horse: Horse
  progress: number
  finished: boolean
}

defineProps<Props>()
</script>

<style scoped>
.racing-lane {
  @apply flex items-center h-[calc((100vh-200px)/10)] border-b border-gray-700/30 last:border-b-0 px-4;
}

.lane-info {
  @apply w-12 flex-shrink-0;
}

.lane-number {
  @apply text-xs text-gray-400 font-mono;
}

.track-area {
  @apply flex-1 relative h-full mx-4;
}

.horse-name {
  @apply absolute left-[50%] text-sm text-white truncate font-medium flex-shrink-0;
}

.finish-badge {
  @apply absolute right-4 top-1/2 -translate-y-1/2 z-20;
}

.finish-content {
  @apply bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg;
}

.finish-icon {
  @apply text-sm;
}

.finish-text {
  @apply text-xs;
}
</style>
