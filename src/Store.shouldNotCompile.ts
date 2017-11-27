import { ComputedStore } from './ComputedStore'
import { createStore } from './createStore'
import { Store } from './Store'

type State = {
   counter: number
   todo: {
      input: string
      list: string[]
      count: number
   }
}

const state = {} as State

const store = createStore(state)
const counterStore = store.focusPath('counter')
const todoStore = store.focusPath('todo')
const todoListStore = todoStore.focusPath('list')

const lens = store.lens
const todoLens = lens.focusPath('todo')

// Mutating state$ @shouldNotCompile
store.state$ = store.state$

// Mutating lens @shouldNotCompile
store.lens = store.lens

////////////////////////////////////////////////////////
// @shouldNotButDoesCompile - Require runtime checks //
//////////////////////////////////////////////////////

// Updating field values with unknown prop @shouldNotButDoesCompile
store.updateFieldValues(state => ({
   unknown: 'unknown'
}))

// Recomposing function @shouldNotButDoesCompile
store.recompose(() => null) // TODO Implement runtime check

// Computing values with higher order function @shouldNotButDoesCompile
store.compute(state => () => null)
