export interface State {
   counter: number
   todo: {
      input: string
      list: TodoItem[]
      count: number
   }
   user: User | undefined
   flag: boolean
}

export interface TodoItem {
   title: string
   done: boolean
}

export interface User {
   name: string
   address: {
      street: string
      city: string
   }
}

export const initialState: State = {
   counter: 42,
   todo: {
      input: 'input',
      list: [
         { title: 'item0', done: false },
         { title: 'item1', done: false },
         { title: 'item2', done: false }
      ],
      count: 42
   },
   user: undefined,
   flag: false
}