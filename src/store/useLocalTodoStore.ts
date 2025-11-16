import dayjs from 'dayjs'
import { Todo } from '../domain/models/Todo'
import { create } from 'zustand'
import { todoRepository } from '../infrastructure/di/Dependencies'

export interface LocalTodoState {
  todos: Todo[]

  fetchAllTodos: () => Promise<void>

  fetchTodosByDate: (targetDate: dayjs.Dayjs) => Promise<void>

  fetchTodoById: (id: number) => Promise<void>

  addTodo: (content: string, date: dayjs.Dayjs) => Promise<void>

  updateTodo: (
    id: number,
    content: string,
    date: dayjs.Dayjs,
    isCompleted: boolean
  ) => Promise<void>

  deleteTodo: (id: number) => Promise<void>
}

export const localTodoStore = create<LocalTodoState>(set => ({
  todos: [],

  fetchAllTodos: async () => {
    const data = await todoRepository.getAllTodos()

    set(() => ({
      todos: data,
    }))
  },

  fetchTodoById: async (id: number) => {
    const data = await todoRepository.getTodoById(id)

    if (!data) {
      return
    }

    set(state => {
      const todos = [...state.todos]
      const index = todos.findIndex(todo => todo.id === id)

      if (index !== -1) {
        todos[index] = data
      } else {
        todos.push(data)
      }

      return { todos }
    })
  },

  fetchTodosByDate: async (targetDate: dayjs.Dayjs) => {
    const todos = await todoRepository.getTodosByDate(targetDate)

    set(() => ({ todos: todos }))
  },

  addTodo: async (content, date) => {
    const todo = await todoRepository.createTodo(content, date)

    set(state => ({ todos: [...state.todos, todo] }))
  },

  updateTodo: async (id, content, date, isCompleted) => {
    await todoRepository.updateTodo(id, content, date, isCompleted)

    set(state => ({
      todos: state.todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, content, date, isCompleted }
        }
        return todo
      }),
    }))
  },

  deleteTodo: async (id: number) => {
    await todoRepository.deleteTodoById(id)

    set(state => ({ todos: state.todos.filter(todo => todo.id !== id) }))
  },
}))
