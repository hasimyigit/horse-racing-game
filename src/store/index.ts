import { createStore, Store } from 'vuex'
import type { HorseModule } from './horse/module'
import horseModule from './horse/module'

export interface StoreState {
  horse: HorseModule
}

const store = createStore<StoreState>({
  modules: {
    horseModule,
  },
})

export default store

export function useStore(): Store<StoreState> {
  return store as Store<StoreState>
}
