<template>
  <div class="event-schedule">
    <!-- Header -->
    <div class="schedule-header">
      <h2 class="title">
        <span class="icon">📅</span>
        Event Schedule
      </h2>
      <div class="progress-indicator">
        <div class="progress-info">
          <span class="progress-text">Progress</span>
          <span class="progress-count">{{ completedRounds.length }}/{{ rounds.length }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }" />
        </div>
      </div>
    </div>

    <!-- Schedule List -->
    <div class="schedule-list">
      <div
        v-for="round in rounds"
        :key="round.roundNumber"
        class="event-item"
        :class="{
          current: round.roundNumber === activeRoundIndex + 1,
          completed: round.status === 'COMPLETED',
          upcoming: round.status === 'PENDING',
        }"
      >
        <div class="event-indicator">
          <div class="indicator-dot" :class="round.status.toLowerCase()"></div>
          <div class="indicator-line" v-if="round.roundNumber < rounds.length"></div>
        </div>

        <div class="event-content">
          <div class="event-header">
            <div class="event-main">
              <h3 class="event-name">Round {{ round.roundNumber }}</h3>
              <div class="event-meta">
                <span class="distance">{{ round.distance }}m</span>
                <span class="participants">{{ round.participants.length }} horses</span>
              </div>
            </div>
            <div class="event-status">
              <span class="status-badge" :class="round.status.toLowerCase()">
                {{ round.status.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <div class="event-participants">
            <div class="participants-scroll">
              <div
                v-for="horse in round.participants"
                :key="horse.id"
                class="participant-mini"
                :style="{ backgroundColor: horse.color }"
                :title="horse.name"
              >
                <span class="participant-emoji">🐎</span>
              </div>
            </div>
          </div>

          <div v-if="round.results.length > 0" class="event-results">
            <div class="results-title">Top 3</div>
            <div class="podium">
              <div
                v-for="result in round.results.slice(0, 3)"
                :key="result.horseId"
                class="podium-item"
                :class="`position-${result.position}`"
              >
                <div class="podium-medal">{{ getMedalEmoji(result.position) }}</div>
                <div class="podium-info">
                  <span class="horse-name">{{ getHorseName(result.horseId, round) }}</span>
                  <span class="horse-points">{{ result.points }} pts</span>
                </div>
                <div class="podium-time">{{ formatTime(result.completionTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="rounds.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No Events Scheduled</h3>
      <p>Generate events to create the race schedule</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RaceRound } from '@/types'
import useRaceStore from '@/store/race/composable'

const { rounds, activeRoundIndex, completedRounds } = useRaceStore()

const progressPercentage = computed(() => {
  const completed = completedRounds.value.length
  const total = rounds.value.length
  return total > 0 ? (completed / total) * 100 : 0
})

function getHorseName(horseId: string, round: RaceRound): string {
  const horse = round.participants.find((h) => h.id.toString() === horseId)
  return horse?.name || 'Unknown'
}

function getMedalEmoji(position: number): string {
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
.event-schedule {
  @apply bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 h-full flex flex-col;
}

.schedule-header {
  @apply p-4 border-b border-gray-700;
}

.title {
  @apply text-xl font-bold text-white flex items-center gap-2 mb-3;
}

.icon {
  @apply text-2xl;
}

.progress-indicator {
  @apply space-y-2;
}

.progress-info {
  @apply flex justify-between items-center;
}

.progress-text {
  @apply text-sm text-gray-400;
}

.progress-count {
  @apply text-sm text-gray-400 font-semibold;
}

.progress-bar {
  @apply w-full h-2 bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500;
}

.schedule-list {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.event-item {
  @apply flex gap-4;
}

.event-indicator {
  @apply flex flex-col items-center;
}

.indicator-dot {
  @apply w-4 h-4 rounded-full border-2 border-gray-600 bg-gray-700 relative z-10;
}

.indicator-dot.completed {
  @apply border-green-400 bg-green-500;
}

.indicator-dot.in_progress {
  @apply border-blue-400 bg-blue-500 animate-pulse;
}

.indicator-dot.pending {
  @apply border-gray-400 bg-gray-600;
}

.indicator-line {
  @apply flex-1 w-0.5 bg-gray-600 mt-1;
}

.event-content {
  @apply flex-1 bg-gray-700/30 rounded-xl p-3 border border-gray-600 transition-all duration-200;
}

.event-item.current .event-content {
  @apply border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20;
}

.event-item.completed .event-content {
  @apply border-green-400/50 bg-green-500/5;
}

.event-header {
  @apply flex items-start justify-between mb-3;
}

.event-main {
  @apply flex-1;
}

.event-name {
  @apply font-semibold text-white text-base;
}

.event-meta {
  @apply flex gap-3 mt-1;
}

.distance,
.participants {
  @apply text-xs text-gray-400;
}

.event-status {
  @apply flex-shrink-0;
}

.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.status-badge.completed {
  @apply bg-green-500/20 text-green-400;
}

.status-badge.in_progress {
  @apply bg-blue-500/20 text-blue-400;
}

.status-badge.pending {
  @apply bg-gray-500/20 text-gray-400;
}

.event-participants {
  @apply mb-3;
}

.participants-scroll {
  @apply flex gap-1 overflow-x-auto pb-2;
}

.participant-mini {
  @apply w-8 h-8 rounded-lg flex items-center justify-center text-xs border border-gray-600 flex-shrink-0;
}

.event-results {
  @apply pt-3 border-t border-gray-600;
}

.results-title {
  @apply text-xs text-gray-400 font-semibold mb-2;
}

.podium {
  @apply space-y-2;
}

.podium-item {
  @apply flex items-center gap-3 bg-gray-600/30 rounded-lg p-2;
}

.podium-item.position-1 {
  @apply bg-yellow-500/10 border border-yellow-500/20;
}

.podium-item.position-2 {
  @apply bg-gray-400/10 border border-gray-400/20;
}

.podium-item.position-3 {
  @apply bg-orange-500/10 border border-orange-500/20;
}

.podium-medal {
  @apply text-lg flex-shrink-0;
}

.podium-info {
  @apply flex-1 min-w-0;
}

.horse-name {
  @apply text-sm text-white font-medium block truncate;
}

.horse-points {
  @apply text-xs text-gray-400;
}

.podium-time {
  @apply text-xs text-gray-400 flex-shrink-0;
}

.empty-state {
  @apply flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400;
}

.empty-icon {
  @apply text-4xl mb-4 opacity-50;
}

.empty-state h3 {
  @apply text-lg font-semibold mb-2 text-white;
}

.empty-state p {
  @apply text-sm;
}

/* Custom scrollbar for schedule list */
.schedule-list::-webkit-scrollbar {
  width: 6px;
}

.schedule-list::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded;
}

.schedule-list::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}

.schedule-list::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

/* Custom scrollbar for participants */
.participants-scroll::-webkit-scrollbar {
  height: 4px;
}

.participants-scroll::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded;
}

.participants-scroll::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}
</style>
