import { createStore, Store } from 'vuex'
import type { HorseModule } from './horse/module'
import horseModule from './horse/module'
import type { RaceModule } from './race/module'
import type { ResultModule } from './result/module'
import raceModule from './race/module'
import resultModule from './result/module'

export interface StoreState {
  horse: HorseModule
  race: RaceModule
  result: ResultModule
}

const store = createStore<StoreState>({
  modules: {
    horseModule,
    raceModule,
    resultModule,
  },
})

export default store

export function useStore(): Store<StoreState> {
  return store as Store<StoreState>
}
