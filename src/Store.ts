import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'
import { FieldsUpdater, FieldUpdaters, FieldValues, Lens, NotAnArray, UnfocusedLens, Updater } from 'immutable-lens'

export type FieldLenses<State, RecomposedState> = object & NotAnArray & {[K in keyof RecomposedState]: Lens<State, RecomposedState[K]>}

export interface Store<State> {

   readonly state$: Observable<State>
   readonly lens: UnfocusedLens<State>
   readonly path: string

   ////////////
   // FOCUS //
   //////////

   focusOn<K extends keyof State>(this: Store<State & NotAnArray>,
                                  key: K): Store<State[K]>

   focusWith<Target>(lens: Lens<State, Target>): Store<Target>

   focusPath<K extends keyof State>(this: Store<State & NotAnArray>,
                                    key: K): Store<State[K]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1]>(key1: K1, key2: K2): Store<State[K1][K2]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1],
      K3 extends keyof State[K1][K2]>(key1: K1, key2: K2, key3: K3): Store<State[K1][K2][K3]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1],
      K3 extends keyof State[K1][K2],
      K4 extends keyof State[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): Store<State[K1][K2][K3][K4]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1],
      K3 extends keyof State[K1][K2],
      K4 extends keyof State[K1][K2][K3],
      K5 extends keyof State[K1][K2][K3][K4]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): Store<State[K1][K2][K3][K4][K5]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1],
      K3 extends keyof State[K1][K2],
      K4 extends keyof State[K1][K2][K3],
      K5 extends keyof State[K1][K2][K3][K4],
      K6 extends keyof State[K1][K2][K3][K4][K5]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): Store<State[K1][K2][K3][K4][K5][K6]>

   focusPath<K1 extends keyof State,
      K2 extends keyof State[K1],
      K3 extends keyof State[K1][K2],
      K4 extends keyof State[K1][K2][K3],
      K5 extends keyof State[K1][K2][K3][K4],
      K6 extends keyof State[K1][K2][K3][K4][K5],
      K7 extends keyof State[K1][K2][K3][K4][K5][K6]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6, key7: K7): Store<State[K1][K2][K3][K4][K5][K6][K7]>

   focusFields<K extends keyof State>(this: Store<State & NotAnArray>, ...keys: K[]): Store<Pick<State, K>>

   recompose<RecomposedState>(this: Store<State & object & NotAnArray>,
                              fields: FieldLenses<State, RecomposedState>): Store<RecomposedState>

   ///////////
   // READ //
   /////////

   pluck<K extends keyof State>(this: Store<State & NotAnArray>,
                                key: K): Observable<State[K]>

   map<T>(selector: (state: State) => T): Observable<T>

   pick<K extends keyof State>(this: Store<State & NotAnArray>,
                               ...keys: K[]): Observable<Pick<State, K>>

   extract<ExtractedState>(this: Store<State & object>,
                           fields: FieldLenses<State, ExtractedState>): Observable<ExtractedState>

   /////////////
   // UPDATE //
   ///////////

   setValue(newValue: State): void

   update(updater: Updater<State>): void

   setFieldValues(this: Store<State & NotAnArray>,
                  newValues: FieldValues<State>): void

   updateFields(this: Store<State & NotAnArray>,
                updaters: FieldUpdaters<State>): void

   updateFieldValues(this: Store<State & NotAnArray>,
                     fieldsUpdater: FieldsUpdater<State>): void

   // TODO API DESIGN
   // setIndexValues()
   // updateIndexes()
   // updateIndexValues()

   reset(this: Store<State>): void

   pipe(...updaters: Updater<State>[]): void

}
