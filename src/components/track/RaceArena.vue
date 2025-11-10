<template>
  <div class="race-arena">
    <!-- Race Header -->
    <div class="race-header">
      <div class="header-main">
        <h2 class="title">
          <span class="icon">🏁</span>
          Race Arena
        </h2>
        <div class="race-info" v-if="currentRound">
          <span class="round">Round {{ currentRound.roundNumber }}</span>
          <span class="distance">{{ currentRound.distance }}m</span>
          <span class="status" :class="currentRound.status.toLowerCase()">
            {{ currentRound.status.replace('_', ' ') }}
          </span>
        </div>
        <div class="race-info" v-else>
          <span class="no-race">No Active Race</span>
        </div>
      </div>
    </div>

    <!-- Main Race Area -->
    <div class="race-main">
      <!-- Track Container -->
      <div class="track-container">
        <div class="track-background">
          <!-- Finish Line -->
          <div class="finish-line">
            <div class="finish-flag">🏁</div>
            <div class="finish-text">FINISH</div>
          </div>
        </div>

        <!-- Racing Lanes -->
        <div class="racing-lanes">
          <RacingLane
            v-for="(horse, index) in currentRound?.participants || []"
            :key="horse.id"
            :lane-number="index + 1"
            :horse="horse"
            :progress="getHorseProgress(horse.id)"
            :finished="getHorseFinishData(horse.id).finished"
          />
        </div>
      </div>
    </div>

    <!-- No Race State -->
    <div v-if="!currentRound" class="no-race-state">
      <div class="no-race-content">
        <div class="no-race-icon">🏇</div>
        <h3>Ready to Race</h3>
        <p>Generate events and start racing to see the action here</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useRaceStore from '@/store/race/composable'
import RacingLane from './RacingLane.vue'

interface Props {
  isRacing: boolean
}

defineProps<Props>()

const { currentRound, getHorseFinishData, getHorseProgress } = useRaceStore()
</script>

<style scoped>
.race-arena {
  @apply rounded-xl bg-gray-800/90 backdrop-blur-md   border-gray-700 min-h-[calc(100vh-120px)] flex flex-col;
}

.race-header {
  @apply p-4 border-b border-gray-700;
}

.header-main {
  @apply flex items-center justify-between;
}

.title {
  @apply text-xl font-bold text-white flex items-center gap-2;
}

.icon {
  @apply text-2xl;
}

.race-info {
  @apply flex items-center gap-4;
}

.round,
.distance {
  @apply text-gray-300 text-sm;
}

.status {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.status.completed {
  @apply bg-green-500/20 text-green-400;
}

.status.in_progress {
  @apply bg-blue-500/20 text-blue-400;
}

.status.pending {
  @apply bg-yellow-500/20 text-yellow-400;
}

.no-race {
  @apply text-gray-400 text-sm;
}

.race-main {
  @apply flex-1 flex flex-col  gap-4 min-h-0;
}

.track-container {
  @apply flex-1 relative bg-gradient-to-b from-gray-900 to-gray-800  border border-gray-600 overflow-hidden;
}

.track-background {
  @apply absolute inset-0;
}

.lane-numbers {
  @apply absolute left-4 top-0 bottom-0 flex flex-col justify-around py-8;
}

.lane-number {
  @apply w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-xs text-gray-300 font-bold;
}

.lane-lines {
  @apply absolute inset-0 flex flex-col justify-between;
}

.lane-line {
  @apply h-px bg-gray-600/30 mx-16;
}

.finish-line {
  @apply absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 flex flex-col items-center justify-center gap-2;
}

.finish-flag {
  @apply text-2xl;
}

.finish-text {
  @apply text-xs text-yellow-400 font-bold rotate-90 whitespace-nowrap;
}

.racing-lanes {
  @apply relative h-full;
}

.live-leaderboard {
  @apply bg-gray-700/50 rounded-xl border border-gray-600;
}

.leaderboard-header {
  @apply flex items-center justify-between p-3 border-b border-gray-600;
}

.leaderboard-header h3 {
  @apply font-semibold text-white;
}

.live-indicator {
  @apply flex items-center gap-2 text-red-400 text-sm font-semibold;
}

.pulse-dot {
  @apply w-2 h-2 bg-red-400 rounded-full animate-pulse;
}

.leaderboard-content {
  @apply p-3 space-y-2 max-h-40 overflow-y-auto;
}

.leaderboard-item {
  @apply transition-all duration-200;
}

.item-main {
  @apply flex items-center gap-3 p-2 rounded-lg;
}

.leaderboard-item.first .item-main {
  @apply bg-yellow-500/10 border border-yellow-500/30;
}

.leaderboard-item.second .item-main {
  @apply bg-gray-400/10 border border-gray-400/30;
}

.leaderboard-item.third .item-main {
  @apply bg-orange-500/10 border border-orange-500/30;
}

.position {
  @apply w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0;
}

.leaderboard-item.first .position {
  @apply bg-yellow-500 text-white;
}

.leaderboard-item.second .position {
  @apply bg-gray-400 text-gray-900;
}

.leaderboard-item.third .position {
  @apply bg-orange-500 text-white;
}

.horse-color {
  @apply w-4 h-4 rounded-full flex-shrink-0;
}

.horse-info {
  @apply flex-1 min-w-0;
}

.horse-name {
  @apply text-sm text-white font-medium block truncate;
}

.progress-bar {
  @apply w-full h-1 bg-gray-600 rounded-full overflow-hidden mt-1;
}

.progress-fill {
  @apply h-full bg-blue-500 rounded-full transition-all duration-300;
}

.leaderboard-item.first .progress-fill {
  @apply bg-yellow-400;
}

.leaderboard-item.second .progress-fill {
  @apply bg-gray-400;
}

.leaderboard-item.third .progress-fill {
  @apply bg-orange-400;
}

.progress-text {
  @apply text-xs text-gray-400 w-8 text-right flex-shrink-0;
}

.no-race-state {
  @apply flex-1 flex items-center justify-center;
}

.no-race-content {
  @apply text-center text-gray-400;
}

.no-race-icon {
  @apply text-6xl mb-4 opacity-50;
}

.no-race-content h3 {
  @apply text-xl font-semibold mb-2 text-white;
}

/* Custom scrollbar for leaderboard */
.leaderboard-content::-webkit-scrollbar {
  width: 4px;
}

.leaderboard-content::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded;
}

.leaderboard-content::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}
</style>
