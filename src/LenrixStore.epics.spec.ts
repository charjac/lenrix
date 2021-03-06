import { expect } from 'chai'
import { pipe } from 'rxjs'
import { distinctUntilChanged, filter, map, mapTo } from 'rxjs/operators'

import { createStore } from './createStore'
import { silentLoggerOptions } from './logger/silentLoggerOptions'
import { Store } from './Store'

type State = {
   counter: number
   todo: {
      input: string
      list: string[]
      count: number
   }
}

const initialState: State = {
   counter: 0,
   todo: {
      input: '',
      list: [],
      count: 0
   }
}

interface Actions {
   buttonClicked: void
   incrementCounter: void
   setCounter: number
   setTodoCount: number
}

describe('LenrixStore.epics()', () => {
   let store: Store<{
      state: State
      computedValues: {}
      actions: Actions
      dependencies: {}
   }>

   beforeEach(() => {
      store = createStore(initialState, { logger: silentLoggerOptions })
         .actionTypes<Actions>()
         .updates(_ => ({
            incrementCounter: () => _.updateFields({ counter: val => val + 1 }),
            setCounter: counter => _.setFields({ counter }),
            setTodoCount: todoCount =>
               _.focusPath('todo', 'count').setValue(todoCount)
         }))
         .epics({
            buttonClicked: mapTo({ incrementCounter: undefined })
         })
   })

   it('dispatches actions', () => {
      store.dispatch({ buttonClicked: undefined })
      expect(store.currentState.counter).to.equal(1)
   })

   it('dispatches actions for every dispatched epic', () => {
      store.dispatch({ buttonClicked: undefined })
      store.dispatch({ buttonClicked: undefined })
      expect(store.currentState.counter).to.equal(2)
   })

   it('throws error when dispatching two action types in same object', () => {
      expect(() => {
         createStore(initialState, { logger: silentLoggerOptions })
            .actionTypes<Actions>()
            .epics({
               buttonClicked: mapTo({
                  setCounter: 0,
                  incrementCounter: undefined
               })
            })
            .dispatch({ buttonClicked: undefined, setCounter: 0 })
      }).to.throw()
   })

   it('gives registered epics access to store currentState', () => {
      expect(store.currentState.todo.list.length).to.equal(0)
      expect(store.currentState.todo.count).to.equal(0)
      store.dispatch({ setCounter: 1 })
      expect(store.currentState.counter).to.equal(1)

      const todoStore = store.focusPath('todo')
      todoStore.epics({
         setTodoCount: (payload$, lightStore) =>
            payload$.pipe(
               filter(
                  payload => payload === lightStore.currentState.list.length
               ),
               map(payload => ({ setCounter: payload }))
            )
      })

      store.dispatch({ setTodoCount: 0 })

      expect(store.currentState.counter).to.equal(0)
   })

   it('supports distinctUntilChanged()', () => {
      expect(store.currentState.counter).to.equal(0)
      store.epics({
         setTodoCount: pipe(
            distinctUntilChanged(),
            mapTo({ incrementCounter: undefined })
         )
      })
      store.dispatch({ setTodoCount: 42 })
      expect(store.currentState.counter).to.equal(1)
      store.dispatch({ setTodoCount: 42 })
      expect(store.currentState.counter).to.equal(1)
   })

   it('supports multiple epics for single action', () => {
      expect(store.currentState.counter).to.equal(0)
      store.epics({
         setTodoCount: mapTo({ incrementCounter: undefined })
      })
      store.epics({
         setTodoCount: mapTo({ incrementCounter: undefined })
      })
      store.dispatch({ setTodoCount: 42 })
      expect(store.currentState.counter).to.equal(2)
   })
})
