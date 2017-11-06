import { FieldLenses, NotAnArray } from 'immutable-lens'
import { Observable } from 'rxjs/Observable'
import { Store } from './Store'

export interface ReadableStore<State> {

   readonly state$: Observable<State>
   readonly currentState: State

   pluck<K extends keyof State>(this: ReadableStore<State & NotAnArray>,
                                key: K): Observable<State[K]>

   map<T>(selector: (state: State) => T): Observable<T>

   pick<K extends keyof State>(this: Store<State & NotAnArray>,
                               ...keys: K[]): Observable<Pick<State, K>>

   cherryPick<ExtractedState>(this: Store<State & object>,
                              fields: FieldLenses<State, ExtractedState>): Observable<ExtractedState>

}