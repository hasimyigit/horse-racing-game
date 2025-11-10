import { createStore, Store } from 'vuex'
import type { HorseModule } from './horse/module'
import horseModule from './horse/module'
import raceModule, { RaceModule } from './race/module'
import resultModule, { ResultModule } from './result/module'

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
