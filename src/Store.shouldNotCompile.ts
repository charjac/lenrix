import { ComputedStore } from './ComputedStore';
import { createStore } from './createStore';
import { Store } from './Store';

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
const counterStore = store.focusOn('counter')
const todoStore = store.focusOn('todo')
const todoListStore = todoStore.focusOn('list')

const lens = store.lens
const todoLens = lens.focusOn('todo')

// Mutating state$ @shouldNotCompile
store.state$ = store.state$

// Mutating lens @shouldNotCompile
store.lens = store.lens

////////////
// FOCUS //
//////////

// Focusing on null key @shouldNotCompile
store.focusOn(null)

// Focusing on undefined key @shouldNotCompile
store.focusOn(undefined)

// Focusing on non-string key @shouldNotCompile
store.focusOn(42)

// Focusing on object key @shouldNotCompile
store.focusOn({})

// Focusing on function key @shouldNotCompile
store.focusOn(() => 'counter')

// Focusing on unknown key @shouldNotCompile
store.focusOn('unknown')

// Focusing unknown field @shouldNotCompile
store.focusFields('unknown')

// Focusing fields on arrayFocusedStore @shouldNotCompile
todoListStore.focusFields('length')

// Focusing key on array-focused store @shouldNotCompile
todoListStore.focusOn('length')

// Focusing null index @shouldNotCompile
todoListStore.focusIndex(null)

// Focusing undefined index @shouldNotCompile
todoListStore.focusIndex(undefined)

// Focusing non-number index @shouldNotCompile
todoListStore.focusIndex('42')

// Focusing object index @shouldNotCompile
todoListStore.focusIndex({})

// Focusing index on primitive-focused store @shouldNotCompile
counterStore.focusIndex(4)

// Focusing index on object-focused store @shouldNotCompile
todoStore.focusIndex(4)

// Recomposing null @shouldNotCompile
store.recompose(null)

// Recomposing undefined @shouldNotCompile
store.recompose(undefined)

// Recomposing number @shouldNotCompile
store.recompose(42)

// Recomposing string @shouldNotCompile
store.recompose('counter')

// Recomposing array @shouldNotCompile
store.recompose([])

// Recomposing with wrong source type Lens @shouldNotCompile
store.recompose({ todoList: todoListStore.lens })

// Recomposing with wrong source type Lens @shouldNotCompile
const recomposedStore: Store<{ todoList: number[] }> = store.recompose({ todoList: todoLens.focusOn('list') })

//////////////
// COMPUTE //
////////////

// Calling compute() @compiles
store.compute(state => ({
   todoListLength: state.todo.list.length
}))

// Computing values with array @shouldNotCompile
store.compute(state => [state.todo.list.length])

// Assigning computed store with wrong ComputeValues type @shouldNotCompile
const computedWithWrongType: ComputedStore<State, { todoListLength: 0 }> = store.compute(state => ({
   todoListLength: state.todo.list.length
}))

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
