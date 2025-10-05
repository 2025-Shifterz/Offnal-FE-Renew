import { create } from 'zustand'
import api from '../infrastructure/remote/api/axiosInstance'

export interface Todo {
  id: number
  content: string
  completed: boolean
  targetDate: number
  organizationId: number
}

export interface TodoState {
  todos: Todo[]

  // fetch
  fetchTodos: (filter: string, organizationId: number) => Promise<void>
  addTodo: (todo: Todo) => void
  updateTodo: (id: number, updatedFields: Partial<Todo>) => void
  deleteTodo: (id: number) => void
}

export const useTodoStore = create<TodoState>(set => ({
  todos: [],

  addTodo: async todo => {
    try {
      const response = await api.post('/todos', todo)
      console.log('Todo added successfully:', response.data)
      set(state => ({ todos: [...state.todos, todo] }))
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  },

  // content, completed, targetDate 필요한 필드만 업데이트
  updateTodo: async (id, updatedFields) => {
    const existingTodo = useTodoStore
      .getState()
      .todos.find(todo => todo.id === id)
    if (!existingTodo) {
      console.error(`Todo with id ${id} not found.`)
      return
    }
    // 수정된 하나의 todo 객체
    const fullUpdatedTodo = { ...existingTodo, ...updatedFields }

    try {
      const response = await api.patch(`/todos`, fullUpdatedTodo)
      console.log('Todo updated successfully:', response.data)
      set(state => ({
        todos: state.todos.map(todo =>
          todo.id === id ? fullUpdatedTodo : todo
        ),
      }))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  },

  deleteTodo: async id => {
    try {
      await api.delete(`/todos/${id}`)
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
      }))
      console.log('Todo deleted successfully')
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  },

  // 서버에서 투두 리스트 불러오기
  fetchTodos: async (filter, organizationId) => {
    try {
      const response = await api.get(
        `/todos?filter=${filter}&organizationId=${organizationId}`
      )
      console.log('Fetched todos successfully:', response.data)
      set({ todos: response.data.result })
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  },
}))
