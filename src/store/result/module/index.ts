import type { Module } from 'vuex'
import type { RaceResult, Rankings } from '@/types'
import type { StoreState } from '@/store'

export interface ResultModule {
  roundResults: RaceResult[]
  rankings: Rankings[]
}

const resultModule: Module<ResultModule, StoreState> = {
  namespaced: true,

  state: (): ResultModule => ({
    roundResults: [],
    rankings: [],
  }),

  getters: {
    getResultsByRound:
      (state) =>
      (roundNumber: number): RaceResult[] => {
        return state.roundResults.filter((result) => result.roundNumber === roundNumber)
      },

    getHorsePerformanceHistory:
      (state) =>
      (horseId: string): RaceResult[] => {
        return state.roundResults.filter((result) => result.horseId === horseId)
      },

    championHorse: (state): Rankings | null => {
      if (state.rankings.length === 0) return null

      return state.rankings.reduce((champion, current) =>
        current.totalPoints > champion.totalPoints ? current : champion,
      )
    },

    sortedStandings: (state): Rankings[] => {
      return [...state.rankings].sort((a, b) => b.totalPoints - a.totalPoints)
    },

    hasResults: (state): boolean => {
      return state.roundResults.length > 0
    },
  },

  mutations: {
    ADD_ROUND_RESULT(state, result: RaceResult) {
      state.roundResults.push(result)
    },

    ADD_ROUND_RESULTS(state, results: RaceResult[]) {
      state.roundResults.push(...results)
    },

    SET_OVERALL_STANDINGS(state, standings: Rankings[]) {
      state.rankings = standings
    },

    CLEAR_RESULTS(state) {
      state.roundResults = []
      state.rankings = []
    },
  },

  actions: {
    recordRoundResult({ commit, dispatch }, result: RaceResult) {
      commit('ADD_ROUND_RESULT', result)
      dispatch('calculateStandings')
    },

    recordRoundResults({ commit, dispatch }, results: RaceResult[]) {
      commit('ADD_ROUND_RESULTS', results)
      dispatch('calculateStandings')
    },

    calculateStandings({ state, commit, rootGetters }) {
      const standingsMap = new Map<string, Rankings>()

      state.roundResults.forEach((result: RaceResult) => {
        const horse = rootGetters['horseModule/getHorseById'](result.horseId)
        if (!horse) return

        if (!standingsMap.has(result.horseId)) {
          standingsMap.set(result.horseId, {
            horseId: result.horseId,
            horseName: horse.name,
            horseColor: horse.color,
            totalPoints: 0,
            racesParticipated: 0,
            averagePosition: 0,
            bestPosition: Infinity,
            positions: [],
          })
        }

        const standing = standingsMap.get(result.horseId)!
        standing.totalPoints += result.points
        standing.racesParticipated++
        standing.positions.push(result.position)
        standing.bestPosition = Math.min(standing.bestPosition, result.position)
      })

      standingsMap.forEach((standing: Rankings) => {
        const sum = standing.positions.reduce((acc: number, pos: number) => acc + pos, 0)
        standing.averagePosition = sum / standing.positions.length
      })

      commit('SET_OVERALL_STANDINGS', Array.from(standingsMap.values()))
    },

    clearResults({ commit }) {
      commit('CLEAR_RESULTS')
    },
  },
}

export default resultModule
