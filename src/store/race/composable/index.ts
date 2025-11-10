import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RaceProgress, Horse, RaceResult } from '@/types'
import { RaceStatus, RoundStatus } from '@/types'
import { calculatePoints } from '@/utils/race-helper'

export interface HorseFinishData {
  finished: boolean
  time: string
  points: number
}

export default function useRaceStore() {
  const store = useStore()
  // --- 🔹 STATE ---
  const rounds = computed(() => store.state.raceModule.rounds)
  const activeRoundIndex = computed(() => store.state.raceModule.activeRoundIndex)
  const raceStatus = computed(() => store.state.raceModule.state)
  const progressByHorse = computed(() => store.state.raceModule.progressByHorse)
  const currentProgress = computed(() => store.state.raceModule.progressByHorse)

  // --- 🔹 GETTERS ---
  const currentRound = computed(() => store.getters['raceModule/currentRound'])
  const isInProgress = computed(() => store.getters['raceModule/isInProgress'])
  const completedRounds = computed(() => store.getters['raceModule/completedRounds'])
  const pendingRounds = computed(() => store.getters['raceModule/pendingRounds'])
  const isAllCompleted = computed(() => store.getters['raceModule/isAllCompleted'])
  const isScheduleReady = computed(() => store.getters['raceModule/isScheduleReady'])

  // --- 🔹 ACTIONS ---
  const createSchedule = async () => await store.dispatch('raceModule/createSchedule')
  const startRound = () => store.dispatch('raceModule/startRound')
  const updateHorseProgress = (horseId: string, progress: RaceProgress) =>
    store.dispatch('raceModule/updateHorseProgress', { horseId, progress })
  const completeRound = () => store.dispatch('raceModule/completeRound')
  const moveToNextRound = () => store.dispatch('raceModule/moveToNextRound')
  const resetRace = () => store.dispatch('raceModule/resetRace')

  const getAllHorseProgress = (): Promise<RaceProgress[]> =>
    store.dispatch('raceModule/getAllHorseProgress')

  // --- 🔹 MUTATIONS ---
  const setRaceState = (newState: RaceStatus) => store.commit('raceModule/SET_RACE_STATE', newState)
  const updateRoundStatus = (index: number, status: RoundStatus) =>
    store.commit('raceModule/UPDATE_ROUND_STATUS', { index, status })
  const setRoundResults = (index: number, results: RaceResult[]) =>
    store.commit('raceModule/SET_ROUND_RESULTS', { index, results })
  const clearProgress = () => store.commit('raceModule/CLEAR_PROGRESS')

  const getHorseProgress = (horseId: string): number => {
    const progress = store.state.raceModule.progressByHorse[horseId]
    return progress?.progress ?? 0
  }
  //
  const getHorseFinishData = (horseId: string): HorseFinishData => {
    const progress = store.state.raceModule.progressByHorse[horseId]

    if (!progress || !progress.finished) {
      return { finished: false, time: '0.00', points: 0 }
    }

    const finishMs = progress.viewerFinishTime ?? progress.realElapsedTime
    const timeInSeconds = finishMs ? (finishMs / 1000).toFixed(2) : '0.00'

    const allProgress = Object.values(store.state.raceModule.progressByHorse)
    const finishedHorses = (allProgress as RaceProgress[])
      .filter((p: RaceProgress) => p.finished && p.realElapsedTime)
      .sort(
        (a: RaceProgress, b: RaceProgress) => (a.realElapsedTime ?? 0) - (b.realElapsedTime ?? 0),
      )

    const position = finishedHorses.findIndex((p: RaceProgress) => p.horseId === horseId) + 1
    const points = calculatePoints(position)

    return {
      finished: true,
      time: timeInSeconds,
      points,
    }
  }

  const getSortedHorses = computed<Horse[]>(() => {
    if (!currentRound.value) return []

    const progressData = Object.values(store.state.raceModule.progressByHorse) as RaceProgress[]
    interface HorseWithProgress extends Horse {
      currentProgress: number
    }

    const horsesWithProgress: HorseWithProgress[] = currentRound.value.participants.map(
      (horse: Horse) => {
        const progress = progressData.find((p: RaceProgress) => p.horseId === horse.id.toString())
        return {
          ...horse,
          currentProgress: progress?.progress ?? 0,
        }
      },
    )

    return horsesWithProgress.sort(
      (a: HorseWithProgress, b: HorseWithProgress) => b.currentProgress - a.currentProgress,
    )
  })

  return {
    // --- state ---
    rounds,
    activeRoundIndex,
    raceStatus,
    progressByHorse,
    currentProgress,

    // --- getters ---
    currentRound,
    isInProgress,
    completedRounds,
    pendingRounds,
    isAllCompleted,
    isScheduleReady,

    // --- actions ---
    createSchedule,
    startRound,
    updateHorseProgress,
    completeRound,
    moveToNextRound,
    resetRace,
    getHorseProgress,
    getAllHorseProgress,

    // --- mutations ---
    setRaceState,
    updateRoundStatus,
    setRoundResults,
    clearProgress,

    getHorseFinishData,
    getSortedHorses,
  }
}
