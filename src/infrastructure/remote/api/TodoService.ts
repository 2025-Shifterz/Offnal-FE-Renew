import { GetTodosResponse } from '../response/GetTodosResponse'
import { PostCreateTodoRequest } from '../request/PostCreateTodoRequest'
import { PatchUpdateTodoRequest } from '../request/PatchUpdateTodoRequest'
import { apiAxiosClient } from '../axios/createApiAxiosClient'

export class TodoService {
  async getTodos(filter: string, organizationId: number) {
    try {
      const response = await apiAxiosClient.get<GetTodosResponse>(
        `/todos?filter=${filter}&organizationId=${organizationId}`
      )
      return response.data.result
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  }

  async createTodo(request: PostCreateTodoRequest) {
    try {
      const response = await apiAxiosClient.post('/todos', request)
      return response.data
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  async updateTodo(request: PatchUpdateTodoRequest) {
    try {
      const response = await apiAxiosClient.put(`/todos`, request)
      return response.data
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  async deleteTodo(todoId: number) {
    try {
      const response = await apiAxiosClient.delete(`/todos/${todoId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
}
