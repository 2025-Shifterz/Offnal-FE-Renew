import api from './axiosInstance'
import { Todo } from '../../../shared/types/Todo'
import { GetTodosResponse } from '../response/GetTodosResponse'

export class TodoService {
  async getTodos(filter: string, organizationId: number) {
    try {
      const response = await api.get<GetTodosResponse>(
        `/todos?filter=${filter}&organizationId=${organizationId}`
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  }

  async createTodo(todo: Todo) {
    try {
      const response = await api.post('/todos', todo)
      return response.data
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  async updateTodo(todo: Todo) {
    try {
      const response = await api.put(`/todos`, todo)
      return response.data
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  async deleteTodo(todoId: number) {
    try {
      const response = await api.delete(`/todos/${todoId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
}
