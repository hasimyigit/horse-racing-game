import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, Store } from 'vuex'
import type { RaceRound, Horse } from '@/types'
import { RaceStatus, RoundStatus } from '@/types'

import { TOTAL_ROUNDS, ROUND_DISTANCES, HORSES_PER_RACE } from '@/constants'
import horseModule from '@/store/horse/module'
import resultModule from '@/store/result/module'
import raceModule from '@/store/race/module'
import type { StoreState } from '@/store'

describe('Race Store', () => {
  let store: Store<StoreState>

  const mockHorses: Horse[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Horse ${i}`,
    color: `#${i.toString(16).repeat(6)}`,
    condition: 50 + i,
  }))

  beforeEach(async () => {
    store = createStore<StoreState>({
      modules: {
        horseModule,
        raceModule,
        resultModule,
      },
    })

    await store.dispatch('horseModule/generateHorses')
  })

  describe('initial state', () => {
    it('expected rounds to be empty initially', () => {
      expect(store.state.raceModule.rounds).toEqual([])
    })

    it('expected activeRoundIndex to be 0 initially', () => {
      expect(store.state.raceModule.activeRoundIndex).toBe(0)
    })

    it('expected state to be Idle initially', () => {
      expect(store.state.raceModule.state).toBe(RaceStatus.Idle)
    })

    it('expected progressByHorse to be empty initially', () => {
      expect(store.state.raceModule.progressByHorse).toEqual({})
    })
  })

  describe('getters', () => {
    beforeEach(async () => {
      await store.dispatch('raceModule/createSchedule')
    })

    it('expected currentRound to return current round', () => {
      const currentRound = store.getters['raceModule/currentRound']
      expect(currentRound).toBeDefined()
      expect(currentRound.roundNumber).toBe(1)
    })

    it('expected isInProgress to be false when race not in progress', () => {
      expect(store.getters['raceModule/isInProgress']).toBe(false)
    })

    it('expected isInProgress to be true when race in progress', async () => {
      await store.dispatch('raceModule/startRound')
      expect(store.getters['raceModule/isInProgress']).toBe(true)
    })

    it('expected completedRounds to return completed rounds', async () => {
      await store.dispatch('raceModule/startRound')
      await store.dispatch('raceModule/completeRound')

      const completedRounds = store.getters['raceModule/completedRounds']
      expect(completedRounds).toHaveLength(1)
      expect(completedRounds[0].status).toBe(RoundStatus.Completed)
    })

    it('expected pendingRounds to return pending rounds', () => {
      const pendingRounds = store.getters['raceModule/pendingRounds']
      expect(pendingRounds).toHaveLength(TOTAL_ROUNDS)
    })

    it('expected isAllCompleted to be false when not all rounds completed', () => {
      expect(store.getters['raceModule/isAllCompleted']).toBe(false)
    })

    it('expected isScheduleReady to be true when schedule is ready', () => {
      expect(store.getters['raceModule/isScheduleReady']).toBe(true)
    })

    it('expected rounds to return all rounds', () => {
      const rounds = store.getters['raceModule/rounds']
      expect(rounds).toHaveLength(TOTAL_ROUNDS)
    })

    it('expected activeRoundIndex to return current index', () => {
      expect(store.getters['raceModule/activeRoundIndex']).toBe(0)
    })

    it('expected raceStatus to return current status', () => {
      expect(store.getters['raceModule/raceStatus']).toBe(RaceStatus.ScheduleReady)
    })
  })

  describe('mutations', () => {
    it('expected SET_SCHEDULE to set rounds', () => {
      const rounds: RaceRound[] = [
        {
          roundNumber: 1,
          distance: 1200,
          participants: mockHorses.slice(0, 10),
          status: RoundStatus.Pending,
          results: [],
        },
      ]

      store.commit('raceModule/SET_SCHEDULE', rounds)
      expect(store.state.raceModule.rounds).toEqual(rounds)
    })

    it('expected SET_ACTIVE_ROUND_INDEX to set active round index', () => {
      store.commit('raceModule/SET_ACTIVE_ROUND_INDEX', 2)
      expect(store.state.raceModule.activeRoundIndex).toBe(2)
    })

    it('expected SET_RACE_STATE to set race state with valid transition', () => {
      store.commit('raceModule/SET_RACE_STATE', RaceStatus.ScheduleReady)
      expect(store.state.raceModule.state).toBe(RaceStatus.ScheduleReady)
    })

    it('expected UPDATE_ROUND_STATUS to update round status', () => {
      const rounds: RaceRound[] = [
        {
          roundNumber: 1,
          distance: 1200,
          participants: mockHorses.slice(0, 10),
          status: RoundStatus.Pending,
          results: [],
        },
      ]
      store.commit('raceModule/SET_SCHEDULE', rounds)

      store.commit('raceModule/UPDATE_ROUND_STATUS', {
        index: 0,
        status: RoundStatus.InProgress,
      })

      expect(store.state.raceModule.rounds[0].status).toBe(RoundStatus.InProgress)
    })

    it('expected UPDATE_HORSE_PROGRESS to update horse progress', () => {
      store.commit('raceModule/UPDATE_HORSE_PROGRESS', {
        horseId: '1',
        progress: { horseId: '1', progress: 50, speed: 10, finished: false },
      })

      expect(store.state.raceModule.progressByHorse['1']).toEqual({
        horseId: '1',
        progress: 50,
        speed: 10,
        finished: false,
      })
    })

    it('expected CLEAR_PROGRESS to clear all horse progress', () => {
      store.commit('raceModule/UPDATE_HORSE_PROGRESS', {
        horseId: '1',
        progress: { horseId: '1', progress: 50, speed: 10, finished: false },
      })

      store.commit('raceModule/CLEAR_PROGRESS')
      expect(store.state.raceModule.progressByHorse).toEqual({})
    })

    it('expected RESET_RACE_MODULE to reset entire module', () => {
      const rounds: RaceRound[] = [
        {
          roundNumber: 1,
          distance: 1200,
          participants: mockHorses.slice(0, 10),
          status: RoundStatus.Pending,
          results: [],
        },
      ]
      store.commit('raceModule/SET_SCHEDULE', rounds)
      store.commit('raceModule/SET_ACTIVE_ROUND_INDEX', 5)
      store.commit('raceModule/SET_RACE_STATE', RaceStatus.ScheduleReady)

      store.commit('raceModule/RESET_RACE_MODULE')

      expect(store.state.raceModule.rounds).toEqual([])
      expect(store.state.raceModule.activeRoundIndex).toBe(0)
      expect(store.state.raceModule.state).toBe(RaceStatus.Idle)
      expect(store.state.raceModule.progressByHorse).toEqual({})
    })
  })

  describe('actions', () => {
    it('expected createSchedule to create schedule with correct structure', async () => {
      await store.dispatch('raceModule/createSchedule')

      const rounds = store.state.raceModule.rounds
      expect(rounds).toHaveLength(TOTAL_ROUNDS)

      rounds.forEach((round, index) => {
        expect(round.roundNumber).toBe(index + 1)
        expect(round.distance).toBe(ROUND_DISTANCES[index])
        expect(round.participants).toHaveLength(HORSES_PER_RACE)
        expect(round.status).toBe(RoundStatus.Pending)
        expect(round.results).toEqual([])
      })

      expect(store.state.raceModule.state).toBe(RaceStatus.ScheduleReady)
      expect(store.state.raceModule.activeRoundIndex).toBe(0)
    })

    it('expected startRound to start the current round', async () => {
      await store.dispatch('raceModule/createSchedule')
      await store.dispatch('raceModule/startRound')

      expect(store.state.raceModule.state).toBe(RaceStatus.RaceInProgress)
      expect(store.state.raceModule.rounds[0].status).toBe(RoundStatus.InProgress)
      expect(store.state.raceModule.rounds[0].startTime).toBeDefined()

      const round = store.getters['raceModule/currentRound']
      round.participants.forEach((horse: Horse) => {
        const progress = store.state.raceModule.progressByHorse[horse.id]
        expect(progress).toEqual({
          horseId: horse.id,
          progress: 0,
          speed: 0,
          finished: false,
        })
      })
    })

    it('expected completeRound to complete the current round', async () => {
      await store.dispatch('raceModule/createSchedule')
      await store.dispatch('raceModule/startRound')
      await store.dispatch('raceModule/completeRound')

      expect(store.state.raceModule.state).toBe(RaceStatus.RaceCompleted)
      expect(store.state.raceModule.rounds[0].status).toBe(RoundStatus.Completed)
      expect(store.state.raceModule.rounds[0].endTime).toBeDefined()
    })

    it('expected moveToNextRound to move to next round', async () => {
      await store.dispatch('raceModule/createSchedule')
      await store.dispatch('raceModule/startRound')
      await store.dispatch('raceModule/completeRound')
      await store.dispatch('raceModule/moveToNextRound')

      expect(store.state.raceModule.activeRoundIndex).toBe(1)
      expect(store.state.raceModule.state).toBe(RaceStatus.ScheduleReady)
      expect(store.state.raceModule.progressByHorse).toEqual({})
    })

    it('expected updateHorseProgress to update horse progress', async () => {
      const progress = { horseId: '1', progress: 75, speed: 15, finished: false }
      await store.dispatch('raceModule/updateHorseProgress', { horseId: '1', progress })

      expect(store.state.raceModule.progressByHorse['1']).toEqual(progress)
    })

    it('expected getHorseProgress to return horse progress', async () => {
      const progress = { horseId: '1', progress: 75, speed: 15, finished: false }
      store.commit('raceModule/UPDATE_HORSE_PROGRESS', { horseId: '1', progress })

      const result = await store.dispatch('raceModule/getHorseProgress', '1')
      expect(result).toEqual(progress)
    })

    it('expected getAllHorseProgress to return all horse progress', async () => {
      const progress1 = { horseId: '1', progress: 75, speed: 15, finished: false }
      const progress2 = { horseId: '2', progress: 50, speed: 12, finished: false }

      store.commit('raceModule/UPDATE_HORSE_PROGRESS', { horseId: '1', progress: progress1 })
      store.commit('raceModule/UPDATE_HORSE_PROGRESS', { horseId: '2', progress: progress2 })

      const result = await store.dispatch('raceModule/getAllHorseProgress')
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(progress1)
      expect(result).toContainEqual(progress2)
    })

    it('expected resetRace to reset race module', async () => {
      await store.dispatch('raceModule/createSchedule')
      await store.dispatch('raceModule/startRound')

      await store.dispatch('raceModule/resetRace')

      expect(store.state.raceModule.rounds).toEqual([])
      expect(store.state.raceModule.activeRoundIndex).toBe(0)
      expect(store.state.raceModule.state).toBe(RaceStatus.Idle)
      expect(store.state.raceModule.progressByHorse).toEqual({})
    })
  })

  describe('state transitions', () => {
    it('expected startRound to not allow from IDLE state', async () => {
      store.commit('raceModule/RESET_RACE_MODULE')
      expect(store.state.raceModule.state).toBe(RaceStatus.Idle)

      try {
        await store.dispatch('raceModule/startRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch('Cannot start race while in state IDLE')
      }
    })

    it('expected completeRound to not allow from SCHEDULE_READY state', async () => {
      await store.dispatch('raceModule/createSchedule')

      try {
        await store.dispatch('raceModule/completeRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch(
          'Cannot complete round while in state SCHEDULE_READY',
        )
      }
    })

    it('expected moveToNextRound to not allow from SCHEDULE_READY state', async () => {
      await store.dispatch('raceModule/createSchedule')

      try {
        await store.dispatch('raceModule/moveToNextRound')
        expect.fail('Expected an error to be thrown')
      } catch (error) {
        expect((error as Error).message).toMatch(
          'Cannot move to next round while in state SCHEDULE_READY',
        )
      }
    })

    it('expected state to transition to ALL_RACES_COMPLETED after final round', async () => {
      await store.dispatch('raceModule/createSchedule')

      for (let i = 0; i < TOTAL_ROUNDS; i++) {
        await store.dispatch('raceModule/startRound')
        await store.dispatch('raceModule/completeRound')

        if (i < TOTAL_ROUNDS - 1) {
          await store.dispatch('raceModule/moveToNextRound')
        }
      }

      expect(store.state.raceModule.state).toBe(RaceStatus.AllRacesCompleted)
      expect(store.getters['raceModule/isAllCompleted']).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('expected invalid state transitions to throw error', () => {
      expect(() => {
        store.commit('raceModule/SET_RACE_STATE', RaceStatus.RaceInProgress)
      }).toThrow('Invalid race state transition')
    })

    it('expected mutations to handle missing rounds gracefully', () => {
      expect(() => {
        store.commit('raceModule/UPDATE_ROUND_STATUS', {
          index: 999,
          status: RoundStatus.InProgress,
        })
      }).not.toThrow()

      expect(() => {
        store.commit('raceModule/SET_ROUND_START_TIME', { index: 999, time: Date.now() })
      }).not.toThrow()

      expect(() => {
        store.commit('raceModule/SET_ROUND_END_TIME', { index: 999, time: Date.now() })
      }).not.toThrow()

      expect(() => {
        store.commit('raceModule/SET_ROUND_RESULTS', { index: 999, results: [] })
      }).not.toThrow()
    })
  })
})
