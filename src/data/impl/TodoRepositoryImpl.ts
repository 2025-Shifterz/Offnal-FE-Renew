import { Dayjs } from 'dayjs'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoDao } from '../../infrastructure/local/dao/TodoDao'
import { toTodoDomain, toTodosDomain } from '../mappers/TodoMapper'
import { Todo } from '../../domain/models/Todo'

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private todoDao: TodoDao) {}

  async createTodo(content: string, targetDate: Dayjs): Promise<void> {
    return await this.todoDao.createTodo(content, targetDate)
  }

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.todoDao.getAllTodos()
    const result = toTodosDomain(todos)

    return result
  }

  async getTodoById(id: number): Promise<Todo | null> {
    const todo = await this.todoDao.getTodoById(id)
    if (!todo) {
      return null
    }
    const result = toTodoDomain(todo)

    return result
  }

  async getTodosByDate(targetDate: Dayjs): Promise<Todo[]> {
    const todos = await this.todoDao.getTodosByDate(targetDate)
    const result = toTodosDomain(todos)

    return result
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
