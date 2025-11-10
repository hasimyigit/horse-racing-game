<template>
  <div
    class="event-card"
    :class="{
      'border-cyan-400 shadow-cyan-500/20': isCurrent,
      'border-emerald-500 shadow-emerald-500/20': event.status === 'COMPLETED',
      'opacity-60': event.status === 'PENDING' && !isCurrent,
    }"
  >
    <div class="event-header">
      <div>
        <h3 class="event-title">Round {{ event.roundNumber }}</h3>
        <p class="event-distance">{{ event.distance }}m</p>
      </div>

      <div>
        <span
          class="status-badge"
          :class="{
            'bg-emerald-500 text-slate-900': event.status === 'COMPLETED',
            'bg-cyan-500 text-slate-900': event.status === 'IN_PROGRESS',
            'bg-slate-600 text-slate-300': event.status === 'PENDING',
          }"
        >
          {{ event.status }}
        </span>
      </div>
    </div>

    <div class="participants-section">
      <div class="section-label">Competitors:</div>
      <div class="participants-list">
        <div v-for="horse in event.participants" :key="horse.id" class="participant-item">
          <div class="horse-color" :style="{ backgroundColor: horse.color }" />
          <span class="horse-name">{{ horse.name }}</span>
        </div>
      </div>
    </div>

    <div v-if="event.results.length > 0" class="results-section">
      <div class="section-label">Results:</div>
      <div class="results-list">
        <div v-for="result in event.results.slice(0, 3)" :key="result.horseId" class="result-item">
          <span>{{ getPositionBadge(result.position) }} {{ getHorseName(result.horseId) }}</span>
          <span class="points">{{ result.points }} pts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RaceRound } from '@/types'

interface Props {
  event: RaceRound
  isCurrent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCurrent: false,
})

function getHorseName(horseId: string): string {
  const horse = props.event.participants.find((h) => h.id.toString() === horseId)
  return horse?.name || 'Unknown'
}

function getPositionBadge(position: number): string {
  const badges = ['🥇', '🥈', '🥉']
  return badges[position - 1] || `#${position}`
}
</script>

<style scoped>
.event-card {
  @apply glass-panel border-2 border-slate-600 transition-all duration-200;
}

.event-header {
  @apply flex items-center justify-between mb-4;
}

.event-title {
  @apply text-xl font-bold text-slate-100;
}

.event-distance {
  @apply text-slate-400;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-sm font-semibold;
}

.participants-section {
  @apply space-y-2;
}

.section-label {
  @apply text-sm text-slate-400;
}

.participants-list {
  @apply flex flex-wrap gap-2;
}

.participant-item {
  @apply flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-full text-sm;
}

.horse-color {
  @apply w-3 h-3 rounded-full;
}

.horse-name {
  @apply text-slate-200;
}

.results-section {
  @apply mt-4 pt-4 border-t border-slate-700;
}

.results-list {
  @apply space-y-1;
}

.result-item {
  @apply flex items-center justify-between text-sm text-slate-200;
}

.points {
  @apply text-cyan-400 font-semibold;
}
</style>
