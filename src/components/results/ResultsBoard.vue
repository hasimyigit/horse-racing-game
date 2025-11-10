<template>
  <div v-if="hasResults" class="results-board">
    <!-- Header with Stats -->
    <div class="board-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">🏆</div>
          <div>
            <h2 class="title">Race Results</h2>
            <p class="subtitle">{{ completedRounds.length }} rounds completed</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ completedRounds.length }}</div>
            <div class="stat-label">Total Rounds</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getTotalHorses() }}</div>
            <div class="stat-label">Horses Competed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Timeline -->
    <div class="results-timeline">
      <div
        v-for="round in completedRounds"
        :key="round.roundNumber"
        class="timeline-item"
        :class="{ expanded: expandedRounds.has(round.roundNumber) }"
      >
        <!-- Timeline Connector -->
        <div class="timeline-connector">
          <div class="connector-line"></div>
          <div class="round-badge">
            <span class="round-number">{{ round.roundNumber }}</span>
          </div>
        </div>

        <!-- Round Card -->
        <div class="round-card">
          <div class="round-header" @click="toggleRound(round.roundNumber)">
            <div class="round-main">
              <div class="round-title-section">
                <h3 class="round-title">Round {{ round.roundNumber }}</h3>
                <div class="round-meta">
                  <span class="distance-badge">{{ round.distance }}m</span>
                  <span class="horses-badge">{{ round.results.length }} horses</span>
                </div>
              </div>
              <div class="round-winner">
                <div class="winner-label">Winner</div>
                <div class="winner-name">{{ getWinnerName(round) }}</div>
              </div>
            </div>
            <div class="expand-indicator">
              <div class="expand-icon" :class="{ expanded: expandedRounds.has(round.roundNumber) }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expanded Content -->
          <Transition name="slide-down">
            <div v-if="expandedRounds.has(round.roundNumber)" class="round-content">
              <EventResults
                :round-number="round.roundNumber"
                :distance="round.distance"
                :results="round.results"
                :horses="allHorses"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="completedRounds.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No Results Yet</h3>
      <p>Complete races to see detailed results here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RaceRound } from '@/types'
import useHorseStore from '@/store/horse/composable'
import { useResultStore } from '@/store/result/composable'
import useRaceStore from '@/store/race/composable'
import EventResults from './EventResults.vue'

const { allHorses } = useHorseStore()
const { hasResults } = useResultStore()
const { completedRounds } = useRaceStore()

const expandedRounds = ref<Set<number>>(new Set())

watch(
  completedRounds,
  (newRounds: RaceRound[]) => {
    if (newRounds.length > 0) {
      const latestRound = newRounds[newRounds.length - 1]
      expandedRounds.value.add(latestRound?.roundNumber || 0)
    }
  },
  { immediate: true },
)

function toggleRound(roundNumber: number) {
  if (expandedRounds.value.has(roundNumber)) {
    expandedRounds.value.delete(roundNumber)
  } else {
    expandedRounds.value.add(roundNumber)
  }
  expandedRounds.value = new Set(expandedRounds.value)
}

function getWinnerName(round: RaceRound): string {
  const winner = round.results.find((result) => result.position === 1)
  if (!winner) return 'Unknown'
  const horse = round.participants.find((h) => h.id.toString() === winner.horseId)
  return horse?.name || 'Unknown'
}

function getTotalHorses(): number {
  return completedRounds.value.reduce(
    (total: number, round: RaceRound) => total + round.results.length,
    0,
  )
}
</script>

<style scoped>
.results-board {
  @apply bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/50 h-full flex flex-col shadow-2xl;
}

.board-header {
  @apply p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/30;
}

.header-main {
  @apply flex items-center justify-between;
}

.title-section {
  @apply flex items-center gap-4;
}

.title-icon {
  @apply text-3xl;
}

.title {
  @apply text-2xl font-bold text-white;
}

.subtitle {
  @apply text-slate-400 text-sm mt-1;
}

.stats-grid {
  @apply flex gap-4;
}

.stat-card {
  @apply text-center px-4 py-2 bg-slate-700/30 rounded-xl border border-slate-600/30;
}

.stat-value {
  @apply text-xl font-bold text-white;
}

.stat-label {
  @apply text-xs text-slate-400 mt-1;
}

.results-timeline {
  @apply flex-1 overflow-y-auto p-6 space-y-6;
}

.timeline-item {
  @apply flex gap-4;
}

.timeline-connector {
  @apply flex flex-col items-center relative;
}

.connector-line {
  @apply w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 flex-1;
}

.timeline-item:last-child .connector-line {
  @apply opacity-0;
}

.round-badge {
  @apply w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-800 shadow-lg z-10;
}

.round-number {
  @apply text-white font-bold text-sm;
}

.round-card {
  @apply flex-1 bg-slate-700/30 rounded-2xl border border-slate-600/30 transition-all duration-300 hover:border-slate-500/50;
}

.timeline-item.expanded .round-card {
  @apply border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/10;
}

.round-header {
  @apply flex items-center justify-between p-5 cursor-pointer transition-all duration-200;
}

.round-main {
  @apply flex items-center gap-6 flex-1;
}

.round-title-section {
  @apply flex-1;
}

.round-title {
  @apply text-lg font-semibold text-white mb-2;
}

.round-meta {
  @apply flex gap-3;
}

.distance-badge {
  @apply px-3 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs font-medium;
}

.horses-badge {
  @apply px-3 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs font-medium;
}

.round-winner {
  @apply text-right;
}

.winner-label {
  @apply text-xs text-slate-400 mb-1;
}

.winner-name {
  @apply text-sm font-semibold text-white;
}

.expand-indicator {
  @apply flex-shrink-0;
}

.expand-icon {
  @apply w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center text-slate-400 transition-all duration-300;
}

.expand-icon.expanded {
  @apply bg-blue-500/20 text-blue-400 rotate-180;
}

.round-content {
  @apply border-t border-slate-700/50;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.empty-state {
  @apply flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400;
}

.empty-icon {
  @apply text-5xl mb-4 opacity-50;
}

.empty-state h3 {
  @apply text-lg font-semibold mb-2 text-white;
}

.empty-state p {
  @apply text-sm;
}

/* Custom scrollbar */
.results-timeline::-webkit-scrollbar {
  width: 6px;
}

.results-timeline::-webkit-scrollbar-track {
  @apply bg-slate-700/30 rounded;
}

.results-timeline::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-500/50 to-purple-500/50 rounded;
}

.results-timeline::-webkit-scrollbar-thumb:hover {
  @apply from-blue-400 to-purple-400;
}

/* Responsive */
@media (max-width: 768px) {
  .header-main {
    @apply flex-col gap-4 items-start;
  }

  .stats-grid {
    @apply w-full justify-between;
  }

  .round-main {
    @apply flex-col gap-3 items-start;
  }

  .round-winner {
    @apply text-left;
  }
}
</style>
