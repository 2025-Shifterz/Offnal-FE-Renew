import dayjs from 'dayjs'
import { Todo } from '../domain/models/Todo'
import { create } from 'zustand'
import {
  addTodoUseCase,
  deleteTodoUseCase,
  getToDosByDateUseCase,
  getTodosUseCase,
  todoCompletionUseCase,
  updateTodoUseCase,
} from '../infrastructure/di/Dependencies'

export interface LocalTodoState {
  todos: Todo[]
  selectedTodo: Todo | null

  setSelectedTodo: (todo: Todo | null) => void

  initTodos: () => Promise<void>
  getTodosByDate: (date: dayjs.Dayjs) => Promise<void>

  addTodo: (todo: string, date: dayjs.Dayjs) => Promise<void>
  deleteTodo: (id: number, date: dayjs.Dayjs) => Promise<void>
  updateTodoCompleted: (
    id: number,
    currentCompleted: boolean,
    date: dayjs.Dayjs
  ) => Promise<void>
  scheduleToday: () => Promise<void>
  scheduleNextDay: () => Promise<void>
}

export const useLocalTodoStore = create<LocalTodoState>((set, get) => ({
  todos: [],
  selectedTodo: null,

  setSelectedTodo: selectedTodo => set({ selectedTodo }),

  initTodos: async () => {
    const loadedTodos = await getTodosUseCase.execute()
    set({ todos: loadedTodos })
  },

  getTodosByDate: async (date: dayjs.Dayjs) => {
    const loadedTodos = await getToDosByDateUseCase.execute(date)
    set({ todos: loadedTodos })
  },

  addTodo: async (todo: string, date: dayjs.Dayjs) => {
    const todoText = todo.trim()
    if (!todoText) {
      return
    }
    await addTodoUseCase.execute(todoText, date)
    const updatedTodos = await getToDosByDateUseCase.execute(date)
    set({ todos: updatedTodos })
  },

  deleteTodo: async (id: number, date: dayjs.Dayjs) => {
    await deleteTodoUseCase.execute(id)
    const updatedTodos = await getToDosByDateUseCase.execute(date)
    set({ todos: updatedTodos })
  },

  updateTodoCompleted: async (id: number, currentCompleted: boolean) => {
    await todoCompletionUseCase.execute(id, !currentCompleted)
    const updatedTodos = await getTodosUseCase.execute()
    set({ todos: updatedTodos })
  },

  scheduleToday: async () => {
    const { selectedTodo } = get()
    if (selectedTodo) {
      await updateTodoUseCase.execute(selectedTodo.id, undefined, dayjs())
      const updatedTodos = await getTodosUseCase.execute()
      set({ todos: updatedTodos })
    }
  },

  scheduleNextDay: async () => {
    const { selectedTodo } = get()
    if (selectedTodo) {
      await updateTodoUseCase.execute(
        selectedTodo.id,
        undefined,
        dayjs().add(1, 'day')
      )
      const updatedTodos = await getTodosUseCase.execute()
      set({ todos: updatedTodos })
    }
  },
}))
