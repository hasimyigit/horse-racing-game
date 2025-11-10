<template>
  <div class="competitor-roster">
    <!-- Header -->
    <div class="roster-header">
      <div class="header-content">
        <h2 class="title">
          <span class="icon">🏇</span>
          Competitors
        </h2>
        <div class="count-badge">{{ allHorses.length }}</div>
      </div>
    </div>

    <!-- Competitors List -->
    <div class="competitors-list">
      <div
        v-for="horse in filteredCompetitors.value"
        :key="horse.id"
        class="competitor-item"
        :class="{ selected: isCompetitorSelected(horse.id) }"
      >
        <div class="competitor-avatar">
          <div class="avatar" :style="{ backgroundColor: horse.color }">
            <span class="avatar-emoji">🐎</span>
          </div>
          <div class="selection-indicator" v-if="isCompetitorSelected(horse.id)"></div>
        </div>

        <div class="competitor-details">
          <h3 class="name">{{ horse.name }}</h3>
          <p class="id">ID: {{ horse.id }}</p>
          <div class="condition-info">
            <div class="condition-bar">
              <div
                class="condition-fill"
                :style="{ width: `${horse.condition}%` }"
                :class="getConditionClass(horse.condition)"
              />
            </div>
            <span class="condition-value">{{ horse.condition }}%</span>
          </div>
        </div>

        <div class="competitor-status">
          <div v-if="isCompetitorSelected(horse.id)" class="status-badge racing">Racing</div>
          <div v-else class="status-badge resting">Resting</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="allHorses.length === 0" class="empty-state">
      <div class="empty-icon">🏇</div>
      <h3>No Competitors</h3>
      <p>Generate events to see the competitor roster</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Horse } from '@/types'
import useHorseStore from '@/store/horse/composable'
import useRaceStore from '@/store/race/composable'

const { allHorses } = useHorseStore()
const { currentRound } = useRaceStore()

const activeTab = ref<'all' | 'active' | 'resting'>('all')

const filteredCompetitors = computed(() => {
  if (activeTab.value === 'active') {
    return allHorses.value.filter((horse: Horse) => isCompetitorSelected(horse.id.toString()))
  }
  if (activeTab.value === 'resting') {
    return allHorses.value.filter((horse: Horse) => !isCompetitorSelected(horse.id.toString()))
  }
  return allHorses
})

function isCompetitorSelected(horseId: string): boolean {
  if (!currentRound.value) return false
  return currentRound.value.participants.some((h: Horse) => h.id.toString() === horseId)
}

function getConditionClass(condition: number): string {
  if (condition >= 80) return 'condition-excellent'
  if (condition >= 60) return 'condition-good'
  if (condition >= 40) return 'condition-fair'
  return 'condition-poor'
}
</script>

<style scoped>
.competitor-roster {
  @apply bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 max-h-[calc(100vh-120px)] flex flex-col;
}

.roster-header {
  @apply p-4 border-b border-gray-700;
}

.header-content {
  @apply flex items-center justify-between mb-3;
}

.title {
  @apply text-xl font-bold text-white flex items-center gap-2;
}

.icon {
  @apply text-2xl;
}

.count-badge {
  @apply bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-semibold;
}

.filter-tabs {
  @apply flex space-x-1 bg-gray-700 rounded-lg p-1;
}

.tab-button {
  @apply flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 text-gray-300;
}

.tab-button.active {
  @apply bg-blue-500 text-white shadow-lg;
}

.competitors-list {
  @apply flex-1 overflow-y-auto space-y-2 p-4;
}

.competitor-item {
  @apply flex items-center gap-3 bg-gray-700/50 rounded-xl p-3 border-2 border-transparent transition-all duration-200 hover:border-gray-600;
}

.competitor-item.selected {
  @apply border-blue-400 bg-blue-500/10;
}

.competitor-avatar {
  @apply relative flex-shrink-0;
}

.avatar {
  @apply w-12 h-12 rounded-xl border-2 border-gray-600 flex items-center justify-center text-lg;
}

.selection-indicator {
  @apply absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800;
}

.competitor-details {
  @apply flex-1 min-w-0;
}

.name {
  @apply font-semibold text-white truncate text-sm;
}

.id {
  @apply text-xs text-gray-400 mt-1;
}

.condition-info {
  @apply flex items-center gap-2 mt-2;
}

.condition-bar {
  @apply flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden;
}

.condition-fill {
  @apply h-full rounded-full transition-all duration-300;
}

.condition-excellent {
  @apply bg-green-400;
}

.condition-good {
  @apply bg-blue-400;
}

.condition-fair {
  @apply bg-yellow-400;
}

.condition-poor {
  @apply bg-red-400;
}

.condition-value {
  @apply text-xs text-gray-300 w-8 text-right;
}

.competitor-status {
  @apply flex-shrink-0;
}

.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.status-badge.racing {
  @apply bg-green-500/20 text-green-400;
}

.status-badge.resting {
  @apply bg-gray-500/20 text-gray-400;
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

/* Custom scrollbar for competitors list */
.competitors-list::-webkit-scrollbar {
  width: 6px;
}

.competitors-list::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded;
}

.competitors-list::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}

.competitors-list::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style>
