import { create } from 'zustand'
import { todoService } from '../infrastructure/di/Dependencies'

export interface Todo {
  id: number
  content: string
  completed: boolean
  targetDate: string
  organizationId: number
}

export interface TodoState {
  todos: Todo[]

  // fetch
  fetchTodos: (filter: string, organizationId: number) => Promise<void>
  createTodo: (todo: Todo) => void
  updateTodo: (todo: Todo) => void
  deleteTodo: (id: number) => void
}

export const useTodoStore = create<TodoState>(set => ({
  todos: [],

  fetchTodos: async (filter, organizationId) => {
    const data = await todoService.getTodos(filter, organizationId)
    set(() => ({
      todos: data,
    }))
  },

  createTodo: async todo => {
    const data = await todoService.createTodo(todo)
    set(state => ({ todos: [...state.todos, data] }))
  },

  updateTodo: async (todo: Todo) => {
    const data = await todoService.updateTodo(todo)
    set(state => ({
      todos: state.todos.map(t => (t.id === todo.id ? { ...t, ...data } : t)),
    }))
  },

  deleteTodo: async id => {
    await todoService.deleteTodo(id)
    set(state => ({ todos: state.todos.filter(todo => todo.id !== id) }))
  },
}))
