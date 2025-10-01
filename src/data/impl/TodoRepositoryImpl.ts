import { Dayjs } from 'dayjs'
import { Todo } from '../../infrastructure/local/entities/TodoEntity'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoDao } from '../../infrastructure/local/dao/TodoDao'

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private todoDao: TodoDao) {}

  async createTodo(content: string, targetDate: Dayjs): Promise<void> {
    return await this.todoDao.createTodo(content, targetDate)
  }

  async getAllTodos(): Promise<Todo[]> {
    return await this.todoDao.getAllTodos()
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return await this.todoDao.getTodoById(id)
  }

  async getTodosByDate(targetDate: Dayjs): Promise<Todo[]> {
    return await this.todoDao.getTodosByDate(targetDate)
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
