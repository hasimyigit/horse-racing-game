<template>
  <div class="event-results">
    <!-- Results Header -->
    <div class="results-header">
      <div class="header-content">
        <h3 class="results-title">Round {{ roundNumber }} Standings</h3>
        <div class="race-info">
          <span class="distance">{{ distance }}m Race</span>
          <span class="horses-count">{{ results.length }} Competitors</span>
        </div>
      </div>
      <div class="podium-indicator">
        <div class="podium-icon">🏆</div>
      </div>
    </div>

    <!-- Results Grid -->
    <div class="results-grid">
      <!-- Podium Winners -->
      <div v-if="podiumWinners.length > 0" class="podium-section">
        <div class="podium-title">Podium Winners</div>
        <div class="podium-grid">
          <div
            v-for="result in podiumWinners"
            :key="result.horseId"
            class="podium-item"
            :class="`podium-${result.position}`"
          >
            <div class="podium-medal">{{ getMedalIcon(result.position) }}</div>
            <div class="podium-content">
              <div class="horse-info">
                <div
                  class="horse-avatar"
                  :style="{ backgroundColor: getHorseColor(result.horseId) }"
                >
                  <span class="horse-emoji">🐎</span>
                </div>
                <div class="horse-details">
                  <div class="horse-name">{{ getHorseName(result.horseId) }}</div>
                  <div class="horse-position">#{{ result.position }}</div>
                </div>
              </div>
              <div class="performance-stats">
                <div class="time">{{ formatTime(result.completionTime) }}</div>
                <div class="points">{{ result.points }} pts</div>
              </div>
            </div>
            <div class="podium-glow"></div>
          </div>
        </div>
      </div>

      <!-- Other Competitors -->
      <div v-if="otherCompetitors.length > 0" class="competitors-section">
        <div class="section-title">Other Competitors</div>
        <div class="competitors-list">
          <div v-for="result in otherCompetitors" :key="result.horseId" class="competitor-row">
            <div class="position-cell">
              <span class="position-number">{{ result.position }}</span>
            </div>
            <div class="horse-cell">
              <div
                class="horse-color"
                :style="{ backgroundColor: getHorseColor(result.horseId) }"
              ></div>
              <span class="horse-name">{{ getHorseName(result.horseId) }}</span>
            </div>
            <div class="time-cell">
              {{ formatTime(result.completionTime) }}
            </div>
            <div class="points-cell">
              <span class="points-badge">{{ result.points }} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Summary -->
    <div v-if="results.length > 0" class="performance-summary">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">{{ formatTime(fastestTime) }}</div>
          <div class="summary-label">Fastest Time</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">{{ formatTime(slowestTime) }}</div>
          <div class="summary-label">Slowest Time</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">{{ totalPoints }}</div>
          <div class="summary-label">Total Points</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RaceResult, Horse } from '@/types'

interface Props {
  roundNumber: number
  distance: number
  results: RaceResult[]
  horses: Horse[]
}

const props = defineProps<Props>()

const podiumWinners = computed(() => {
  return props.results
    .filter((result) => result.position <= 3)
    .sort((a, b) => a.position - b.position)
})

const otherCompetitors = computed(() => {
  return props.results
    .filter((result) => result.position > 3)
    .sort((a, b) => a.position - b.position)
})

const fastestTime = computed(() => {
  return Math.min(...props.results.map((result) => result.completionTime))
})

const slowestTime = computed(() => {
  return Math.max(...props.results.map((result) => result.completionTime))
})

const totalPoints = computed(() => {
  return props.results.reduce((total, result) => total + result.points, 0)
})

function getHorseName(horseId: string): string {
  const horse = props.horses.find((h) => h.id.toString() === horseId)
  return horse?.name || 'Unknown'
}

function getHorseColor(horseId: string): string {
  const horse = props.horses.find((h) => h.id.toString() === horseId)
  return horse?.color || '#6b7280'
}

function getMedalIcon(position: number): string {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return `${position}`
}

function formatTime(timestamp: number): string {
  const seconds = (timestamp / 1000).toFixed(2)
  return `${seconds}s`
}
</script>

<style scoped>
.event-results {
  @apply p-6 space-y-6;
}

.results-header {
  @apply flex items-center justify-between pb-4 border-b border-slate-700/50;
}

.header-content {
  @apply flex-1;
}

.results-title {
  @apply text-xl font-bold text-white mb-2;
}

.race-info {
  @apply flex gap-4;
}

.distance,
.horses-count {
  @apply text-sm text-slate-400;
}

.podium-indicator {
  @apply flex-shrink-0;
}

.podium-icon {
  @apply text-2xl;
}

.results-grid {
  @apply space-y-6;
}

.podium-section {
  @apply space-y-4;
}

.podium-title {
  @apply text-lg font-semibold text-white;
}

.podium-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.podium-item {
  @apply relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105;
}

.podium-1 {
  @apply bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/30 order-2;
}

.podium-2 {
  @apply bg-gradient-to-br from-slate-500/20 to-gray-500/10 border-slate-500/30 order-1;
}

.podium-3 {
  @apply bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/30 order-3;
}

.podium-medal {
  @apply text-3xl mb-3;
}

.podium-content {
  @apply space-y-3;
}

.horse-info {
  @apply flex items-center gap-3;
}

.horse-avatar {
  @apply w-12 h-12 rounded-xl flex items-center justify-center text-lg border-2 border-white/20;
}

.horse-details {
  @apply flex-1;
}

.horse-name {
  @apply font-semibold text-white text-sm;
}

.horse-position {
  @apply text-xs text-slate-400 mt-1;
}

.performance-stats {
  @apply text-right;
}

.time {
  @apply text-sm font-mono text-white;
}

.points {
  @apply text-xs text-slate-400 mt-1;
}

.podium-glow {
  @apply absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300;
}

.podium-item:hover .podium-glow {
  @apply opacity-100;
}

.podium-1 .podium-glow {
  background: radial-gradient(ellipse at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
}

.podium-2 .podium-glow {
  background: radial-gradient(ellipse at center, rgba(148, 163, 184, 0.2) 0%, transparent 70%);
}

.podium-3 .podium-glow {
  background: radial-gradient(ellipse at center, rgba(251, 146, 60, 0.2) 0%, transparent 70%);
}

.competitors-section {
  @apply space-y-4;
}

.section-title {
  @apply text-lg font-semibold text-white;
}

.competitors-list {
  @apply space-y-2;
}

.competitor-row {
  @apply flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 transition-all duration-200 hover:border-slate-500/50;
}

.position-cell {
  @apply w-8 flex-shrink-0;
}

.position-number {
  @apply w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-300;
}

.horse-cell {
  @apply flex items-center gap-3 flex-1;
}

.horse-color {
  @apply w-3 h-3 rounded-full;
}

.horse-name {
  @apply text-sm text-white font-medium;
}

.time-cell {
  @apply text-sm text-slate-400 font-mono flex-shrink-0;
}

.points-cell {
  @apply flex-shrink-0;
}

.points-badge {
  @apply px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs font-medium;
}

.performance-summary {
  @apply pt-4 border-t border-slate-700/50;
}

.summary-grid {
  @apply grid grid-cols-3 gap-4;
}

.summary-item {
  @apply text-center p-3 bg-slate-700/30 rounded-xl border border-slate-600/30;
}

.summary-value {
  @apply text-lg font-bold text-white mb-1;
}

.summary-label {
  @apply text-xs text-slate-400;
}

/* Responsive */
@media (max-width: 768px) {
  .podium-grid {
    @apply grid-cols-1;
  }

  .competitor-row {
    @apply grid grid-cols-2 gap-2;
  }

  .summary-grid {
    @apply grid-cols-1;
  }
}

/* Animation for podium items */
@keyframes podiumGlow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

.podium-item {
  animation: podiumGlow 3s ease-in-out infinite;
}

.podium-1 {
  animation-delay: 0s;
}
.podium-2 {
  animation-delay: 0.5s;
}
.podium-3 {
  animation-delay: 1s;
}
</style>
