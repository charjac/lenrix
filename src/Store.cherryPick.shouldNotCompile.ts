import { Observable } from 'rxjs'

import { createStore } from './createStore'

type State = {
   counter: number
   todo: {
      input: string
      list: string[]
      count: number
   }
}

const state: State = {} as any

const store = createStore(state)
const todoStore = store.focusPath('todo')
const todoListStore = todoStore.focusPath('list')

const lens = store.localLens
const todoLens = lens.focusPath('todo')

// Cherry-picking with null @shouldNotCompile
store.cherryPick(_ => null)

// Cherry-picking with undefined @shouldNotCompile
store.cherryPick(_ => undefined)

// Cherry-picking with number @shouldNotCompile
store.cherryPick(_ => 42)

// Cherry-picking with string @shouldNotCompile
store.cherryPick(_ => 'counter')

// Cherry-picking with array @shouldNotCompile
store.cherryPick(_ => [])

// Assigning cherryPick to wrong lens-extracted variable type @shouldNotCompile
const lensExtractedState$: Observable<{
   todoList: number[]
}> = store.cherryPick(_ => ({ todoList: todoLens.focusPath('list') }))

// Cherry-picking with wrong lens source type @shouldNotCompile
store.cherryPick(_ => ({ a: todoStore.localLens.focusPath('list') }))

// Cherry-picking with number instead of Lens @shouldNotCompile
store.cherryPick(_ => ({ a: 42 }))

// Cherry-picking with string instead of Lens @shouldNotCompile
store.cherryPick(_ => ({ a: 'counter' }))

// Cherry-picking with object instead of Lens @shouldNotCompile
store.cherryPick(_ => ({ a: {} }))

// Cherry-picking with array instead of Lens @shouldNotCompile
store.cherryPick(_ => ({ a: [] }))

// Cherry-picking with function instead of Lens @shouldNotCompile
store.cherryPick(_ => ({ a: (state: { counter: string }) => null }))

// Cherry-picking with null Lens @shouldNotCompile
store.cherryPick(_ => ({ a: null }))

// Cherry-picking with undefined Lens @shouldNotCompile
store.cherryPick(_ => ({ a: undefined }))

////////////////////////////////////////////////////////
// @shouldNotButDoesCompile - Require runtime checks //
//////////////////////////////////////////////////////

// Cherry-picking function @shouldNotButDoesCompile
store.cherryPick(_ => () => 'counter')
