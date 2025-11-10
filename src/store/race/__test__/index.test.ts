import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, Store } from 'vuex'

import type { RaceRound } from '@/types'
import { MIN_HORSES_FOR_RACE } from '@/constants'
import { RaceStatus } from '@/types'
import horseModule from '@/store/horse/module'
import raceModule from '../module'
import resultModule from '@/store/result/module'
import type { StoreState } from '@/store'

describe('Race Store', () => {
  let store: Store<StoreState>

  beforeEach(() => {
    store = createStore<StoreState>({
      modules: {
        horseModule,
        raceModule,
        resultModule,
      },
    })
  })

  describe('generateSchedule', () => {
    it('expected to build a schedule when the required number of horses is available.', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
        const schedule = store.getters['raceModule/rounds']
        expect(schedule.length).toBe(6)
      }
    })

    it('expected to build a schedule reflecting proper round numbering.', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
        const schedule: RaceRound[] = store.getters['raceModule/rounds']
        schedule.forEach((round, index) => {
          expect(round.roundNumber).toBe(index + 1)
        })
      }
    })

    it('expected to build a schedule with proper distance assignments.', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
        const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
        const schedule: RaceRound[] = store.getters['raceModule/rounds']
        schedule.forEach((round, index) => {
          expect(round.distance).toBe(expectedDistances[index])
        })
      }
    })

    it('expected to pick 10 horses per race', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
        const schedule: RaceRound[] = store.getters['raceModule/rounds']
        schedule.forEach((round) => {
          expect(round.participants.length).toBe(10)
        })
      }
    })

    it('expected to mark the state as SCHEDULE_READY after generating the schedule', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
        expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)
      }
    })
  })

  describe('state transitions', () => {
    beforeEach(async () => {
      // Reset state first
      store.commit('raceModule/RESET_RACE_MODULE')

      // Generate enough horses for testing
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      // Create schedule only if we have enough horses
      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        await store.dispatch('raceModule/createSchedule')
      }
    })

    it('Expected to throw an error when starting a round from IDLE state', async () => {
      store.commit('raceModule/RESET_RACE_MODULE')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.Idle)

      try {
        await store.dispatch('raceModule/startRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch(/Cannot start race while in state IDLE/)
      }
    })

    it('Expected to start a round successfully from SCHEDULE_READY state', async () => {
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)
      await store.dispatch('raceModule/startRound')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.RaceInProgress)
    })

    it('Expected to throw an error when completing a round from SCHEDULE_READY state', async () => {
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)

      try {
        await store.dispatch('raceModule/completeRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch(
          /Cannot complete round while in state SCHEDULE_READY/,
        )
      }
    })

    it('Expected to complete a round successfully from RACE_IN_PROGRESS state', async () => {
      await store.dispatch('raceModule/startRound')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.RaceInProgress)
      await store.dispatch('raceModule/completeRound')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.RaceCompleted)
    })

    it('Expected to throw an error when moving to next round from SCHEDULE_READY state', async () => {
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)

      try {
        await store.dispatch('raceModule/moveToNextRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch(
          /Cannot move to next round while in state SCHEDULE_READY/,
        )
      }
    })

    it('Expected to move to the next round successfully from RACE_COMPLETED state', async () => {
      await store.dispatch('raceModule/startRound')
      await store.dispatch('raceModule/completeRound')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.RaceCompleted)

      await store.dispatch('raceModule/moveToNextRound')
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)
      expect(store.getters['raceModule/activeRoundIndex']).toBe(1)
    })

    it('Expected to transition to ALL_RACES_COMPLETED after the final round', async () => {
      for (let i = 0; i < 6; i++) {
        await store.dispatch('raceModule/startRound')
        await store.dispatch('raceModule/completeRound')

        if (i < 5) {
          await store.dispatch('raceModule/moveToNextRound')
        }
      }

      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.AllRacesCompleted)
      expect(store.getters['raceModule/isAllCompleted']).toBe(true)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      store.commit('raceModule/RESET_RACE_MODULE')
    })

    it('Expected to return false for isInProgress initially', () => {
      expect(store.getters['raceModule/isInProgress']).toBe(false)
    })

    it('Expected to return false for isAllCompleted initially', () => {
      expect(store.getters['raceModule/isAllCompleted']).toBe(false)
    })

    it('Expected to return null for currentRound when no schedule exists', () => {
      expect(store.getters['raceModule/currentRound']).toBeNull()
    })

    it('Expected to return false for isScheduleReady when no schedule exists', () => {
      expect(store.getters['raceModule/isScheduleReady']).toBe(false)
    })
  })
})
