import dayjs from 'dayjs'
import { Todo } from '../domain/models/Todo'
import { create } from 'zustand'
import {
  addTodoUseCase,
  deleteTodoUseCase,
  getTodosUseCase,
  todoCompletionUseCase,
  updateTodoUseCase,
} from '../infrastructure/di/Dependencies'

export interface LocalTodoState {
  todos: Todo[]
  todo: string
  showInput: boolean
  selectedTodo: Todo | null

  setTodo: (todo: string) => void
  setShowInput: (show: boolean) => void
  setSelectedTodo: (todo: Todo | null) => void

  initTodos: () => Promise<void>
  addTodo: (date: dayjs.Dayjs) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  updateTodoCompleted: (id: number, currentCompleted: boolean) => Promise<void>
  scheduleToday: () => Promise<void>
  scheduleNextDay: () => Promise<void>
}

export const useLocalTodoStore = create<LocalTodoState>((set, get) => ({
  todos: [],
  todo: '',
  showInput: false,
  selectedTodo: null,

  setTodo: todo => set({ todo }),
  setShowInput: showInput => set({ showInput }),
  setSelectedTodo: selectedTodo => set({ selectedTodo }),

  initTodos: async () => {
    const loadedTodos = await getTodosUseCase.execute()
    set({ todos: loadedTodos })
  },

  addTodo: async (date: dayjs.Dayjs) => {
    const todoText = get().todo.trim()
    if (!todoText) {
      return
    }
    await addTodoUseCase.execute(todoText, date)
    const updatedTodos = await getTodosUseCase.execute()
    set({ todos: updatedTodos, todo: '' })
  },

  deleteTodo: async (id: number) => {
    await deleteTodoUseCase.execute(id)
    const updatedTodos = await getTodosUseCase.execute()
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
