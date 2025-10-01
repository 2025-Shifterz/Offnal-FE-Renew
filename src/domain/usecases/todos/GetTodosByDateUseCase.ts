import dayjs from 'dayjs'
import { TodoRepository } from '../../repositories/TodoRepository'
import { Todo } from '../../../infrastructure/local/entities/TodoEntity'

export class GetTodosByDateUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    return await this.todoRepository.getTodosByDate(targetDate)
  }
}
