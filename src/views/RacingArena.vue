<template>
  <div class="racing-arena">
    <ArenaHeader @generate-schedule="onGenerateSchedule" @start-race="onStartRace" />

    <div v-if="hasSchedule" class="main-game-container">
      <div class="game-layout">
        <!-- Left Panel - Competitors -->
        <div class="panel competitors-panel">
          <CompetitorRoster />
        </div>

        <!-- Center Panel - Race Track -->
        <div class="panel race-panel">
          <RaceArena :is-racing="raceFlow.isRunning.value" />
        </div>

        <!-- Right Panel - Schedule & Results -->
        <div class="panel side-panels">
          <EventSchedule class="schedule-panel" />
          <ResultsBoard class="results-panel" />
        </div>
      </div>
    </div>

    <WelcomeScreen v-else @generate-schedule="onGenerateSchedule" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRaceFlow } from '@/composables/useRaceFlow'
import useRaceStore from '@/store/race/composable'

// Components
import ArenaHeader from '@/components/arena/ArenaHeader.vue'
import CompetitorRoster from '@/components/competitors/CompetitorRoster.vue'
import RaceArena from '@/components/track/RaceArena.vue'
import EventSchedule from '@/components/schedule/EventSchedule.vue'
import ResultsBoard from '@/components/results/ResultsBoard.vue'
import WelcomeScreen from '@/components/ui/WelcomeScreen.vue'
import useHorseStore from '@/store/horse/composable'

import { useResultStore } from '@/store/result/composable'

const raceFlow = useRaceFlow()
const { createSchedule, rounds } = useRaceStore()
const { hasEnoughHorsesForRace, generateHorses } = useHorseStore()

const { clearResults } = useResultStore()
const hasSchedule = computed(() => rounds.value.length > 0)

function onGenerateSchedule() {
  try {
    generateHorses()

    if (!hasEnoughHorsesForRace.value) {
      console.error('unknown eroro')
      return
    }

    createSchedule()
    clearResults()
  } catch (error: unknown) {
    console.error('Failed to generate rounds:', error)
  }
}

function onStartRace() {
  raceFlow.startRace()
}
</script>

<style scoped>
.racing-arena {
  @apply h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 overflow-hidden flex flex-col;
}

.main-game-container {
  @apply flex-1 p-4 pb-0;
}

.game-layout {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 h-full;
}

.panel {
  @apply h-full flex flex-col;
}

.competitors-panel {
  @apply lg:col-start-1;
}

.race-panel {
  @apply lg:col-start-2;
}

.side-panels {
  @apply lg:col-start-3 flex flex-col gap-4 max-h-[calc(100vh-120px)];
}

.schedule-panel,
.results-panel {
  @apply flex-1 min-h-0;
}
</style>
