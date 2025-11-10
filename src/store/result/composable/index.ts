import { computed } from 'vue'
import { useStore } from '@/store'
import type { RaceResult, Rankings } from '@/types'

export function useResultStore() {
  const store = useStore()

  //
  // 🔹 STATE BINDINGS
  //
  const roundResults = computed<RaceResult[]>(() => store.state.result.roundResults)
  const rankings = computed<Rankings[]>(() => store.state.result.rankings)

  //
  // 🔹 GETTERS
  //
  const getResultsByRound = (roundNumber: number): RaceResult[] =>
    store.getters['resultModule/getResultsByRound'](roundNumber)

  const getHorsePerformanceHistory = (horseId: string): RaceResult[] =>
    store.getters['resultModule/getHorsePerformanceHistory'](horseId)

  const championHorse = computed<Rankings | null>(() => store.getters['resultModule/championHorse'])

  const sortedStandings = computed<Rankings[]>(() => store.getters['resultModule/sortedStandings'])

  const hasResults = computed<boolean>(() => store.getters['resultModule/hasResults'])

  //
  // 🔹 ACTIONS
  //
  const recordRoundResult = async (result: RaceResult) => {
    await store.dispatch('resultModule/recordRoundResult', result)
  }

  const recordRoundResults = async (results: RaceResult[]) => {
    await store.dispatch('resultModule/recordRoundResults', results)
  }

  const calculateStandings = async () => {
    await store.dispatch('resultModule/calculateStandings')
  }

  const clearResults = async () => {
    await store.dispatch('resultModule/clearResults')
  }

  //
  // 🔹 MUTATION
  //
  const setOverallStandings = (standings: Rankings[]) => {
    store.commit('resultModule/SET_OVERALL_STANDINGS', standings)
  }

  //
  // 🔹 COMPOSABLE RETURN
  //
  return {
    // state
    roundResults,
    rankings,

    // getters
    getResultsByRound,
    getHorsePerformanceHistory,
    championHorse,
    sortedStandings,
    hasResults,

    // actions
    recordRoundResult,
    recordRoundResults,
    calculateStandings,
    clearResults,

    // optional helpers
    setOverallStandings,
  }
}
