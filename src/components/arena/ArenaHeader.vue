<template>
  <header class="arena-header">
    <div class="header-content">
      <div class="title-section">
        <h1 class="main-title">
          <span class="icon">🎠</span>
          VeliEfendi
        </h1>
      </div>

      <div class="control-section">
        <ActionButton variant="primary" :disabled="!canGenerate" @click="handleGenerate">
          <template #icon>🎯</template>
          Generate Events
        </ActionButton>

        <ActionButton variant="success" :disabled="!canStart" @click="handleStart">
          <template #icon>🚀</template>
          {{ startButtonText }}
        </ActionButton>

        <ActionButton v-if="hasRounds" variant="neutral" @click="handleReset">
          <template #icon>🔄</template>
          Reset Arena
        </ActionButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RaceStatus } from '@/types'
import useRaceStore from '@/store/race/composable'
import useHorseStore from '@/store/horse/composable'
import { useResultStore } from '@/store/result/composable'
import ActionButton from '@/components/ui/ActionButton.vue'

const emit = defineEmits<{
  generateSchedule: []
  startRace: []
}>()

const { raceStatus, rounds, isInProgress, isAllCompleted, moveToNextRound, resetRace } =
  useRaceStore()

const { clearHorses } = useHorseStore()
const { clearResults } = useResultStore()

const hasRounds = computed(() => rounds.value.length > 0)
const canGenerate = computed(
  () => !isInProgress.value && raceStatus.value !== RaceStatus.ScheduleReady,
)
const canStart = computed(
  () => rounds.value.length > 0 && !isInProgress.value && !isAllCompleted.value,
)

const startButtonText = computed(() => {
  if (raceStatus.value === RaceStatus.RaceCompleted) {
    return 'Start Next Round'
  }
  return 'Start Race'
})

async function handleGenerate() {
  try {
    emit('generateSchedule')
  } catch (error: unknown) {
    console.error('Failed to generate rounds:', error)
  }
}

function handleStart() {
  if (raceStatus.value === RaceStatus.RaceCompleted) {
    moveToNextRound()
  }
  emit('startRace')
}

function handleReset() {
  resetRace()
  clearHorses()
  clearResults()
}
</script>

<style scoped>
.arena-header {
  @apply bg-slate-800/50 backdrop-blur-md border-b border-purple-500/30 px-6 py-4;
}

.header-content {
  @apply flex flex-col lg:flex-row-reverse items-start lg:items-center justify-between gap-4;
}

.title-section {
  @apply flex flex-col;
}

.main-title {
  @apply text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent;
}

.control-section {
  @apply flex flex-wrap gap-3;
}
</style>
