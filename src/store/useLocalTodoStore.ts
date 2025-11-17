import dayjs from 'dayjs'
import { Todo } from '../domain/models/Todo'
import { create } from 'zustand'
import {
  addTodoUseCase,
  deleteTodoUseCase,
  getToDosByDateUseCase,
  todoCompletionUseCase,
  updateTodoUseCase,
} from '../infrastructure/di/Dependencies'

export interface LocalTodoState {
  todos: Todo[]

  getTodosByDate: (date: dayjs.Dayjs) => Promise<void>

  addTodo: (todo: string, date: dayjs.Dayjs) => Promise<void>

  deleteTodo: (id: number, date: dayjs.Dayjs) => Promise<void>

  updateTodoContent: (
    id: number,
    content: string,
    date: dayjs.Dayjs
  ) => Promise<void>

  updateTodoCompleted: (
    id: number,
    currentCompleted: boolean,
    date: dayjs.Dayjs
  ) => Promise<void>

  scheduleToday: (selectedTodo: Todo | null, date: dayjs.Dayjs) => Promise<void>

  scheduleNextDay: (
    selectedTodo: Todo | null,
    date: dayjs.Dayjs
  ) => Promise<void>

  scheduleByDate: (
    selectedTodo: Todo | null,
    targetDate: dayjs.Dayjs,
    currentDate: dayjs.Dayjs
  ) => Promise<void>
}

export const useLocalTodoStore = create<LocalTodoState>((set, get) => ({
  todos: [],

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

  updateTodoContent: async (id: number, content: string, date: dayjs.Dayjs) => {
    const todoText = content.trim()
    if (!todoText) {
      return
    }

    await updateTodoUseCase.execute(id, todoText, undefined)
    const updatedTodos = await getToDosByDateUseCase.execute(date)
    set({ todos: updatedTodos })
  },

  updateTodoCompleted: async (
    id: number,
    currentCompleted: boolean,
    date: dayjs.Dayjs
  ) => {
    await todoCompletionUseCase.execute(id, currentCompleted)
    const updatedTodos = await getToDosByDateUseCase.execute(date)
    set({ todos: updatedTodos })
  },

  scheduleToday: async (selectedTodo: Todo | null, date: dayjs.Dayjs) => {
    if (selectedTodo) {
      await updateTodoUseCase.execute(selectedTodo.id, undefined, dayjs())
      const updatedTodos = await getToDosByDateUseCase.execute(date)
      set({ todos: updatedTodos })
    }
  },

  scheduleNextDay: async (selectedTodo: Todo | null, date: dayjs.Dayjs) => {
    if (selectedTodo) {
      await updateTodoUseCase.execute(
        selectedTodo.id,
        undefined,
        date.add(1, 'day')
      )
      const updatedTodos = await getToDosByDateUseCase.execute(date)
      set({ todos: updatedTodos })
    }
  },

  scheduleByDate: async (
    selectedTodo: Todo | null,
    targetDate: dayjs.Dayjs,
    currentDate: dayjs.Dayjs
  ) => {
    if (selectedTodo) {
      await updateTodoUseCase.execute(
        selectedTodo.id,
        selectedTodo.content,
        targetDate
      )

      const updatedTodos = await getToDosByDateUseCase.execute(currentDate)
      set({ todos: updatedTodos })
    }
  },
}))
