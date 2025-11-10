import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '@/types'

export default function useHorseStore() {
  const store = useStore()

  const allHorses = computed(() => store.state.horseModule.allHorses)
  const selectedHorses = computed(() => store.state.horseModule.selectedHorses)
  const availableHorses = computed(() => store.getters['horseModule/availableHorses'])
  const horseCount = computed(() => store.getters['horseModule/horseCount'])
  const hasHorses = computed(() => store.getters['horseModule/hasHorses'])
  const hasEnoughHorsesForRace = computed(() => store.getters['horseModule/hasEnoughHorsesForRace'])

  const getHorseById = (id: number): Horse | undefined =>
    store.getters['horseModule/getHorseById'](id)
  const getAllHorse = (ids: number[]): Horse[] => store.getters['horseModule/getHorsesByIds'](ids)

  const generateHorses = () => store.dispatch('horseModule/generateHorses')
  const pickRandomItemsHorses = async (count: number): Promise<Horse[]> =>
    await store.dispatch('horseModule/pickRandomItemsHorses', count)
  const resetHorses = () => store.dispatch('horseModule/resetHorses')
  const clearHorses = () => store.dispatch('horseModule/clearHorses')

  const updateHorseCondition = (id: number, condition: number) =>
    store.commit('horseModule/UPDATE_HORSE_CONDITION', { id, condition })

  return {
    // state
    allHorses,
    selectedHorses,
    availableHorses,

    // getters
    horseCount,
    hasHorses,
    hasEnoughHorsesForRace,
    getHorseById,
    getAllHorse,

    // actions
    generateHorses,
    pickRandomItemsHorses,
    resetHorses,
    clearHorses,

    // mutations
    updateHorseCondition,
  }
}
