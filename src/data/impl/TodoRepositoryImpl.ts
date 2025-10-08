import { Dayjs } from 'dayjs'
import { Todo } from '../../infrastructure/local/entities/TodoEntity'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoDao } from '../../infrastructure/local/dao/TodoDao'
import { TodoEntity } from '../models/TodoEntity'
import { toTodoDataModel, toTodoDataModelArray } from '../mappers/TodoMapper'

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private todoDao: TodoDao) {}

  async createTodo(content: string, targetDate: Dayjs): Promise<void> {
    return await this.todoDao.createTodo(content, targetDate)
  }

  async getAllTodos(): Promise<TodoEntity[]> {
    try {
      const todos = await this.todoDao.getAllTodos()
      const result = toTodoDataModelArray(todos)

      return result
    } catch (error) {
      throw error
    }
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    try {
      const todo = await this.todoDao.getTodoById(id)
      if (!todo) {
        return null
      }
      const result = toTodoDataModel(todo)

      return result
    } catch (error) {
      throw error
    }
  }

  async getTodosByDate(targetDate: Dayjs): Promise<TodoEntity[]> {
    try {
      const todos = await this.todoDao.getTodosByDate(targetDate)

      if (!todos) {
        return []
      }

      const result = toTodoDataModelArray(todos)

      return result
    } catch (error) {
      throw error
    }
  }

  async updateTodo(
    id: number,
    content?: string,
    targetDate?: Dayjs,
    completed?: boolean
  ): Promise<void> {
    return await this.todoDao.updateTodo(id, content, completed, targetDate)
  }

  async deleteTodoById(id: number): Promise<void> {
    return await this.todoDao.deleteTodoById(id)
  }

  async deleteAllTodos(): Promise<void> {
    return await this.todoDao.deleteAllTodos()
  }
}
