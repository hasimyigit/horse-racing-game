import { createStore, Store } from 'vuex'
import type { HorseModule } from './horse/module'
import horseModule from './horse/module'
import raceModule, { RaceModule } from './race/module'

export interface StoreState {
  horse: HorseModule
  race: RaceModule
}

const store = createStore<StoreState>({
  modules: {
    horseModule,
    raceModule,
  },
})

export default store

export function useStore(): Store<StoreState> {
  return store as Store<StoreState>
}
