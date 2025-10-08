import dayjs from 'dayjs'
import { TodoRepository } from '../../repositories/TodoRepository'
import { toTodoDomain } from '../../mappers/TodoMapper'
import { Todo } from '../../models/Todo'

export class GetTodosByDateUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.getTodosByDate(targetDate)
      const result = todos.map(toTodoDomain)

      return result
    } catch (error) {
      throw error
    }
  }
}
