import { ref, computed } from 'vue'
import type { Horse, RaceProgress } from '@/types'

import {
  calculateHorseSpeed,
  calculateProgressIncrement,
  calculatePoints,
} from '@/utils/race-helper'
import { FRAME_DURATION } from '@/constants'
import useRaceStore from '@/store/race/composable'
import useHorseStore from '@/store/horse/composable'
import { useResultStore } from '@/store/result/composable'

export function useRaceFlow() {
  const {
    currentProgress: _currentProgress,
    clearProgress,
    updateHorseProgress,
    currentRound,
    getAllHorseProgress,
    startRound,
    completeRound,
  } = useRaceStore()
  const { getHorseById } = useHorseStore()
  const { recordRoundResults } = useResultStore()

  const isRunning = ref(false)
  const animationFrameId = ref<number | null>(null)
  const lastFrameTime = ref<number>(0)
  const raceStartTime = ref<number>(0)
  const speedMultiplier = ref(40)
  const realElapsedMs = ref(0)
  const viewerElapsedMs = ref(0)

  const currentProgress = computed((): RaceProgress[] => {
    return Object.values(_currentProgress.value)
  })

  function initializeRace(horses: Horse[], distance: number) {
    raceStartTime.value = Date.now()
    clearProgress()

    horses.forEach((horse: Horse, index: number) => {
      const latest: Horse | undefined = getHorseById(horse.id)
      const source = latest ?? horse
      const speed = calculateHorseSpeed(source, distance)
      let expectedFinishTime = (distance / speed) * 1000
      const indexVariance = index * 10
      const randomVariance = Math.random() * 100 - 50
      const speedVariance = (speed / 10) * (Math.random() - 0.5)

      expectedFinishTime += indexVariance + randomVariance + speedVariance

      const variance = {
        staminaDecay: 0.05 + Math.random() * 0.1,
        surgeAmp: Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      }
      updateHorseProgress(horse.id.toString(), {
        horseId: horse.id.toString(),
        progress: 0,
        speed,
        finished: false,
        finishTime: undefined,
        realElapsedTime: null,
        expectedFinishTime,
        viewerFinishTime: null,
        variance,
      })
    })
  }

  function animate(timestamp: number) {
    if (!isRunning.value) return

    const deltaTime = lastFrameTime.value === 0 ? FRAME_DURATION : timestamp - lastFrameTime.value
    lastFrameTime.value = timestamp

    const adjustedDeltaTime = deltaTime * speedMultiplier.value

    realElapsedMs.value += deltaTime
    viewerElapsedMs.value += adjustedDeltaTime

    if (!currentRound) {
      stopRace()
      return
    }

    let allFinished = true
    const progressArray = currentProgress.value

    progressArray.forEach(async (progress: RaceProgress) => {
      if (!progress?.finished) {
        const pNorm = Math.max(0, Math.min(1, progress.progress / 100))
        const v = progress.variance
        const dynamicFactor = v
          ? Math.max(
              0.85,
              1 - v.staminaDecay * pNorm + Math.sin(v.phase + pNorm * Math.PI * 2) * v.surgeAmp,
            )
          : 1

        const effSpeed = progress.speed * dynamicFactor
        const increment = calculateProgressIncrement(
          effSpeed,
          currentRound.value.distance,
          adjustedDeltaTime,
        )
        const newProgress = Math.min(100, progress.progress + increment)

        const updatedProgress: RaceProgress = {
          ...progress,
          progress: newProgress,
          finished: newProgress >= 100,
        }

        if (updatedProgress.finished && !progress.finished) {
          updatedProgress.finishTime = timestamp

          const allProgress = await getAllHorseProgress()

          const usedHundredths = new Set(
            allProgress
              .filter((p: RaceProgress) => p.finished && p.realElapsedTime != null)
              .map((p: RaceProgress) => Math.floor((p.realElapsedTime as number) / 10)),
          )
          let rt = realElapsedMs.value
          let bucket = Math.floor(rt / 10)
          while (usedHundredths.has(bucket)) {
            rt += 5 + Math.random() * 10
            bucket = Math.floor(rt / 10)
          }
          updatedProgress.realElapsedTime = rt
          updatedProgress.viewerFinishTime = viewerElapsedMs.value
          updatedProgress.expectedFinishTime = progress.expectedFinishTime
        } else if (progress.finished) {
          updatedProgress.finishTime = progress.finishTime
          updatedProgress.realElapsedTime = progress.realElapsedTime
          updatedProgress.viewerFinishTime = progress.viewerFinishTime
          updatedProgress.expectedFinishTime = progress.expectedFinishTime
        }

        updateHorseProgress(progress.horseId, updatedProgress)

        if (!updatedProgress.finished) {
          allFinished = false
        }
      }
    })

    if (allFinished) {
      completeRace()
    } else {
      animationFrameId.value = requestAnimationFrame(animate)
    }
  }

  function startRace() {
    if (!currentRound) {
      throw new Error('No current round to start')
    }

    startRound()
    initializeRace(currentRound.value.participants, currentRound.value.distance)

    realElapsedMs.value = 0
    viewerElapsedMs.value = 0
    isRunning.value = true
    lastFrameTime.value = 0
    animationFrameId.value = requestAnimationFrame(animate)
  }

  function stopRace() {
    isRunning.value = false
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
  }

  function completeRace() {
    stopRace()

    if (!currentRound) return

    const sortedProgress = currentProgress.value.sort((a: RaceProgress, b: RaceProgress) => {
      if (!a.realElapsedTime) return 1
      if (!b.realElapsedTime) return -1
      return a.realElapsedTime - b.realElapsedTime
    })

    const results = sortedProgress.map((progress: RaceProgress, index: number) => {
      const points = calculatePoints(index + 1)
      return {
        roundNumber: currentRound.value.roundNumber,
        horseId: progress.horseId,
        position: index + 1,

        completionTime: progress.viewerFinishTime ?? progress.realElapsedTime ?? 0,
        finalSpeed: progress.speed,
        points,
      }
    })

    currentRound.value.results = results
    recordRoundResults(results)
    completeRound()
  }

  return {
    isRunning,
    currentProgress,
    realElapsedMs,
    viewerElapsedMs,
    startRace,
    stopRace,
    completeRace,
  }
}
