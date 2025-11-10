import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, Store } from 'vuex'

import type { Horse } from '@/types'
import { MIN_HORSES, MAX_HORSES, MIN_HORSES_FOR_RACE } from '@/constants'
import type { StoreState } from '@/store'
import horseModule from '../module'
import raceModule from '@/store/race/module'
import resultModule from '@/store/result/module'

describe('Horses Store', () => {
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

  describe('generateHorses', () => {
    it('Expected to generate between 1 and 20 horses', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horseCount = store.getters['horseModule/horseCount']
      expect(horseCount).toBeGreaterThanOrEqual(MIN_HORSES)
      expect(horseCount).toBeLessThanOrEqual(MAX_HORSES)
    })

    it('Expected to generate horses with unique IDs', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horses: Horse[] = store.getters['horseModule/horses']
      const ids = horses.map((h) => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(horses.length)
    })

    it('Expected to generate horses with unique names', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horses: Horse[] = store.getters['horseModule/horses']
      const names = horses.map((h) => h.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(horses.length)
    })

    it('Expected to generate horses with unique colors', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horses: Horse[] = store.getters['horseModule/horses']
      const colors = horses.map((h) => h.color)
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBe(horses.length)
    })

    it('Expected to generate horses with condition between 1 and 100', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horses: Horse[] = store.getters['horseModule/horses']
      horses.forEach((horse) => {
        expect(horse.condition).toBeGreaterThanOrEqual(1)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('pickRandomItemsHorses', () => {
    it('Expected to select the correct number of horses', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < 10 && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      expect(store.getters['horseModule/horseCount']).toBeGreaterThanOrEqual(10)
      const selected = (await store.dispatch('horseModule/pickRandomItemsHorses', 10)) as Horse[]
      expect(selected.length).toBe(10)
    })

    it('Expected not to select duplicate horses', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < 10 && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      expect(store.getters['horseModule/horseCount']).toBeGreaterThanOrEqual(10)
      const selected = (await store.dispatch('horseModule/pickRandomItemsHorses', 10)) as Horse[]
      const ids = selected.map((h) => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })

    it('Expected to throw an error if requested count exceeds available horses', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horseCount = store.getters['horseModule/horseCount']
      await expect(async () => {
        await store.dispatch('horseModule/pickRandomItemsHorses', horseCount + 5)
      }).rejects.toThrow()
    })
  })

  describe('getters', () => {
    it('Expected to find a horse by ID', async () => {
      await store.dispatch('horseModule/generateHorses')
      const horses = store.getters['horseModule/horses']
      const firstHorse = horses[0]
      const found = store.getters['horseModule/getHorseById'](firstHorse.id) as Horse
      expect(found).toEqual(firstHorse)
    })

    it('Expected to return true for hasEnoughHorsesForRace when >= 10 horses', async () => {
      let attempts = 0
      while (store.getters['horseModule/horseCount'] < MIN_HORSES_FOR_RACE && attempts < 20) {
        await store.dispatch('horseModule/generateHorses')
        attempts++
      }

      if (store.getters['horseModule/horseCount'] >= MIN_HORSES_FOR_RACE) {
        expect(store.getters['horseModule/hasEnoughHorsesForRace']).toBe(true)
      }
    })

    it('Expected to return the correct horse count', async () => {
      expect(store.getters['horseModule/horseCount']).toBe(0)
      await store.dispatch('horseModule/generateHorses')
      const horses = store.getters['horseModule/horses']
      expect(store.getters['horseModule/horseCount']).toBe(horses.length)
    })
  })
})
