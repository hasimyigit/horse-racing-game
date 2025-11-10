import type { Module } from 'vuex'
import type { Horse } from '@/types'
import type { StoreState } from '../../index'

import { getRandomInteger, pickRandomItems } from '@/utils/random'
import {
  HORSE_COLORS,
  HORSE_NAMES,
  MAX_CONDITION,
  MIN_CONDITION,
  MIN_HORSES_FOR_RACE,
} from '@/constants'

export interface HorseModule {
  allHorses: Horse[]
  selectedHorses: Horse[]
}

const horseModule: Module<HorseModule, StoreState> = {
  namespaced: true, //todo

  state: (): HorseModule => ({
    allHorses: [],
    selectedHorses: [],
  }),

  getters: {
    getHorseById:
      (state) =>
      (id: number): Horse | undefined => {
        return state.allHorses.find((horse) => horse.id === id)
      },

    getHorsesByIds:
      (state) =>
      (ids: number[]): Horse[] => {
        return state.allHorses.filter((horse) => ids.includes(horse.id))
      },

    horses: (state): Horse[] => state.allHorses,

    availableHorses: (state): Horse[] => {
      const selectedIds = new Set(state.selectedHorses.map((h) => h.id))
      return state.allHorses.filter((h) => !selectedIds.has(h.id))
    },

    horseCount: (state): number => state.allHorses.length,

    hasEnoughHorsesForRace: (state): boolean => state.allHorses.length >= MIN_HORSES_FOR_RACE,
  },

  mutations: {
    SET_HORSES(state, horses: Horse[]) {
      state.allHorses = horses
    },

    SET_SELECTED_HORSES(state, horses: Horse[]) {
      state.selectedHorses = horses
    },

    //todo
    UPDATE_HORSE_CONDITION(state, { id, condition }: { id: number; condition: number }) {
      const horse = state.allHorses.find((h) => h.id === id)
      if (horse) {
        horse.condition = Math.max(MIN_CONDITION, Math.min(MAX_CONDITION, condition))
      }
    },

    CLEAR_HORSES(state) {
      state.allHorses = []
      state.selectedHorses = []
    },
  },

  actions: {
    generateHorses({ commit }) {
      const shuffledIndices = Array.from({ length: HORSE_NAMES.length }, (_, i) => i).sort(
        () => Math.random() - 0.5,
      )

      const horses: Horse[] = shuffledIndices.map((index, newIndex) => ({
        id: newIndex,
        name: HORSE_NAMES[index]!,
        color: HORSE_COLORS[index]!,
        condition: getRandomInteger(MIN_CONDITION, MAX_CONDITION),
      }))

      commit('SET_HORSES', horses)
      commit('SET_SELECTED_HORSES', [])
    },

    pickRandomItemsHorses({ state, commit }, count: number): Horse[] {
      if (count > state.allHorses.length) {
        throw new Error(`Cannot select ${count} horses from pool of ${state.allHorses.length}`)
      }
      const selected = pickRandomItems(state.allHorses, count) as Horse[]
      commit('SET_SELECTED_HORSES', selected)
      return selected
    },

    resetHorses({ state, commit }) {
      const resetHorses = state.allHorses.map((horse) => ({
        ...horse,
        condition: getRandomInteger(MIN_CONDITION, MAX_CONDITION),
      }))
      commit('SET_HORSES', resetHorses)
      commit('SET_SELECTED_HORSES', [])
    },

    clearHorses({ commit }) {
      commit('CLEAR_HORSES')
    },
  },
}

export default horseModule
