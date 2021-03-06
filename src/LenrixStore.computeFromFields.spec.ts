import { expect } from 'chai'

import { createStore } from './createStore'
import { silentLoggerOptions } from './logger/silentLoggerOptions'
import { Store } from './Store'

interface State {
   name: string
   todo: {
      input: string
      list: string[]
   }
   flag: boolean
}

const initialState: State = {
   name: '',
   todo: {
      input: '',
      list: []
   },
   flag: false
}

describe('LenrixStore.computeFromFields()', () => {
   let store: Store<{
      state: State
      computedValues: {}
      actions: { toggleFlag: void; addToList: string }
      dependencies: {}
   }>
   let computedStore: Store<{
      state: State
      computedValues: { todoListLength: number }
      actions: { toggleFlag: void; addToList: string }
      dependencies: {}
   }>
   let state: State
   let computedState: State & { todoListLength: number }
   let computations: number
   let stateTransitions: number
   let computedStateTransitions: number

   beforeEach(() => {
      computations = 0
      stateTransitions = 0
      computedStateTransitions = 0
      store = createStore(initialState, { logger: silentLoggerOptions })
         .actionTypes<{
            toggleFlag: void
            addToList: string
         }>()
         .updates(_ => ({
            toggleFlag: () => _.focusPath('flag').update(flag => !flag),
            addToList: name =>
               _.focusPath('todo', 'list').update(list => [...list, name])
         }))
      computedStore = store.computeFromFields(['name', 'todo'], ({ todo }) => {
         ++computations
         return {
            todoListLength: todo.list.length
         }
      })
      computedStore.state$.subscribe(s => {
         state = s
         ++stateTransitions
      })
      computedStore.computedState$.subscribe(s => {
         computedState = s
         ++computedStateTransitions
      })
   })

   it('initially has state in current state', () => {
      expect(computedStore.currentState).to.equal(initialState)
      expect(computedStore.currentState).to.deep.equal(initialState)
   })

   it('initially has state in state stream', () => {
      expect(state).to.equal(initialState)
      expect(state).to.deep.equal(initialState)
   })

   it('initially emits normalized state only once', () => {
      expect(stateTransitions).to.equal(1)
   })

   it('initially has computed values in current computed state', () => {
      expect(computedStore.currentComputedState.todoListLength).to.equal(
         initialState.todo.list.length
      )
   })

   it('initially has computed values in computed state stream', () => {
      expect(computedState.todoListLength).to.deep.equal(0)
   })

   it('initially computes initial values once only', () => {
      expect(computations).to.equal(1)
   })

   it('initially emits computed state only once', () => {
      expect(computedStateTransitions).to.equal(1)
   })

   it('does not compute values when unselected fields change', () => {
      computedStore.dispatch({ toggleFlag: undefined })
      expect(computations).to.equal(1)
   })

   it('recomputes values when selected fields change', () => {
      expect(computations).to.equal(1)
      computedStore.dispatch({ addToList: 'Bob' })
      expect(computations).to.equal(2)
      expect(stateTransitions).to.equal(2)
      expect(computedStateTransitions).to.equal(2)
   })

   it('emits new state when updated even if no computation is triggered', () => {
      expect(stateTransitions).to.equal(1)
      computedStore.dispatch({ toggleFlag: undefined })
      expect(computations).to.equal(1)
      expect(stateTransitions).to.equal(2)
      expect(computedStateTransitions).to.equal(2)
   })

   it('has access to light store with currentState', () => {
      const cs = store.computeFromFields(['flag'], (s, lightStore) => ({
         computed: lightStore.currentState.todo
      }))
      expect(cs.currentComputedState.computed).to.equal(store.currentState.todo)
   })

   it('throws error when dispatching action on light store', () => {
      expect(() =>
         store.computeFromFields(['flag'], (s, lightStore) => {
            ;(lightStore as any).dispatch({ toggleFlag: undefined })
            return {
               computed: lightStore.currentState.todo
            }
         })
      ).to.throw()
   })
})
