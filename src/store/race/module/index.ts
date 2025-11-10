import type { Module } from 'vuex'
import type { RaceRound, RaceProgress, RaceResult, Horse } from '@/types'
import { RaceStatus, RoundStatus } from '@/types'
import type { StoreState } from '../../index'
import { TOTAL_ROUNDS, ROUND_DISTANCES, HORSES_PER_RACE, MIN_HORSES_FOR_RACE } from '@/constants'

const VALID_STATE_TRANSITIONS: Record<RaceStatus, RaceStatus[]> = {
  [RaceStatus.Idle]: [RaceStatus.ScheduleReady],
  [RaceStatus.ScheduleReady]: [RaceStatus.RaceInProgress, RaceStatus.Idle],
  [RaceStatus.RaceInProgress]: [RaceStatus.RaceCompleted],
  [RaceStatus.RaceCompleted]: [
    RaceStatus.ScheduleReady,
    RaceStatus.AllRacesCompleted,
    RaceStatus.Idle,
  ],
  [RaceStatus.AllRacesCompleted]: [RaceStatus.Idle],
}

function ensureValidStateTransition(current: RaceStatus, next: RaceStatus): void {
  const allowed = VALID_STATE_TRANSITIONS[current]
  if (!allowed.includes(next)) {
    throw new Error(
      `Invalid race state transition: ${current} -> ${next}. ` +
        `Allowed transitions: ${allowed.join(', ')}`,
    )
  }
}

export interface RaceModule {
  rounds: RaceRound[]
  activeRoundIndex: number
  state: RaceStatus
  progressByHorse: Record<string, RaceProgress>
}

const raceModule: Module<RaceModule, StoreState> = {
  namespaced: true,

  state: (): RaceModule => ({
    rounds: [],
    activeRoundIndex: 0,
    state: RaceStatus.Idle,
    progressByHorse: {},
  }),

  getters: {
    currentRound: (state): RaceRound | null => state.rounds[state.activeRoundIndex] || null,

    isInProgress: (state): boolean => state.state === RaceStatus.RaceInProgress,

    completedRounds: (state): RaceRound[] =>
      state.rounds.filter((round) => round.status === RoundStatus.Completed),

    pendingRounds: (state): RaceRound[] =>
      state.rounds.filter(
        (round) => round.status === RoundStatus.Pending || round.status === RoundStatus.InProgress,
      ),

    isAllCompleted: (state): boolean =>
      state.rounds.length > 0 && state.rounds.every((r) => r.status === RoundStatus.Completed),

    isScheduleReady: (state): boolean =>
      state.rounds.length === TOTAL_ROUNDS && state.state !== RaceStatus.Idle,

    rounds: (state): RaceRound[] => state.rounds,
    activeRoundIndex: (state): number => state.activeRoundIndex,
    raceStatus: (state): RaceStatus => state.state,
  },

  mutations: {
    SET_SCHEDULE(state, rounds: RaceRound[]) {
      state.rounds = rounds
    },

    SET_ACTIVE_ROUND_INDEX(state, index: number) {
      state.activeRoundIndex = index
    },

    SET_RACE_STATE(state, newState: RaceStatus) {
      ensureValidStateTransition(state.state, newState)
      state.state = newState
    },

    UPDATE_ROUND_STATUS(state, { index, status }: { index: number; status: RoundStatus }) {
      if (state.rounds[index]) {
        state.rounds[index].status = status
      }
    },

    SET_ROUND_START_TIME(state, { index, time }: { index: number; time: number }) {
      if (state.rounds[index]) {
        state.rounds[index].startTime = time
      }
    },

    SET_ROUND_END_TIME(state, { index, time }: { index: number; time: number }) {
      if (state.rounds[index]) {
        state.rounds[index].endTime = time
      }
    },

    SET_ROUND_RESULTS(state, { index, results }: { index: number; results: RaceResult[] }) {
      if (state.rounds[index]) {
        state.rounds[index].results = results
      }
    },

    UPDATE_HORSE_PROGRESS(
      state,
      { horseId, progress }: { horseId: string; progress: RaceProgress },
    ) {
      state.progressByHorse[horseId] = progress
    },

    CLEAR_PROGRESS(state) {
      state.progressByHorse = {}
    },

    RESET_RACE_MODULE(state) {
      state.rounds = []
      state.activeRoundIndex = 0
      state.state = RaceStatus.Idle
      state.progressByHorse = {}
    },
  },

  actions: {
    async createSchedule({ commit, dispatch, rootGetters }) {
      if (!rootGetters['horseModule/hasHorses']) {
        await dispatch('horseModule/generateHorses', null, { root: true })
      }

      const horseCount = rootGetters['horseModule/horseCount']
      if (horseCount < MIN_HORSES_FOR_RACE) {
        throw new Error(
          `Not enough horses to start a race. Found ${horseCount}, but at least ${MIN_HORSES_FOR_RACE} are required.`,
        )
      }

      const rounds: RaceRound[] = []
      for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const roundNumber = i + 1
        const distance = ROUND_DISTANCES[i] as number
        const participants = await dispatch('horseModule/pickRandomItemsHorses', HORSES_PER_RACE, {
          root: true,
        })

        rounds.push({
          roundNumber,
          distance,
          participants: [...participants],
          status: RoundStatus.Pending,
          results: [],
        })
      }

      commit('SET_SCHEDULE', rounds)
      commit('SET_ACTIVE_ROUND_INDEX', 0)
      commit('SET_RACE_STATE', RaceStatus.ScheduleReady)
      commit('CLEAR_PROGRESS')
    },

    startRound({ state, commit, getters }) {
      if (state.state !== RaceStatus.ScheduleReady) {
        throw new Error(
          `Cannot start race while in state ${state.state}. Must be in SCHEDULE_READY.`,
        )
      }

      const round = getters.currentRound
      if (!round) throw new Error('No active round to start.')

      commit('UPDATE_ROUND_STATUS', {
        index: state.activeRoundIndex,
        status: RoundStatus.InProgress,
      })
      commit('SET_ROUND_START_TIME', { index: state.activeRoundIndex, time: Date.now() })
      commit('SET_RACE_STATE', RaceStatus.RaceInProgress)

      commit('CLEAR_PROGRESS')
      round.participants.forEach((horse: Horse) => {
        commit('UPDATE_HORSE_PROGRESS', {
          horseId: horse.id,
          progress: { horseId: horse.id, progress: 0, speed: 0, finished: false },
        })
      })
    },

    updateHorseProgress({ commit }, payload: { horseId: string; progress: RaceProgress }) {
      commit('UPDATE_HORSE_PROGRESS', payload)
    },

    completeRound({ state, commit, getters }) {
      if (state.state !== RaceStatus.RaceInProgress) {
        throw new Error(
          `Cannot complete round while in state ${state.state}. Must be RACE_IN_PROGRESS.`,
        )
      }

      const round = getters.currentRound
      if (!round) throw new Error('No active round to complete.')

      commit('UPDATE_ROUND_STATUS', {
        index: state.activeRoundIndex,
        status: RoundStatus.Completed,
      })
      commit('SET_ROUND_END_TIME', { index: state.activeRoundIndex, time: Date.now() })
      commit('SET_RACE_STATE', RaceStatus.RaceCompleted)

      if (getters.isAllCompleted) {
        commit('SET_RACE_STATE', RaceStatus.AllRacesCompleted)
      }
    },

    moveToNextRound({ state, commit }) {
      if (state.state !== RaceStatus.RaceCompleted) {
        throw new Error(
          `Cannot move to next round while in state ${state.state}. Must be RACE_COMPLETED.`,
        )
      }

      if (state.activeRoundIndex < state.rounds.length - 1) {
        commit('SET_ACTIVE_ROUND_INDEX', state.activeRoundIndex + 1)
        commit('SET_RACE_STATE', RaceStatus.ScheduleReady)
        commit('CLEAR_PROGRESS')
      }
    },

    resetRace({ commit }) {
      commit('RESET_RACE_MODULE')
    },

    getHorseProgress({ state }, horseId: string): RaceProgress | undefined {
      return state.progressByHorse[horseId]
    },

    getAllHorseProgress({ state }): RaceProgress[] {
      return Object.values(state.progressByHorse)
    },
  },
}

export default raceModule
