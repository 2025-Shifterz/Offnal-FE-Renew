import dayjs from 'dayjs'
import { TodoRepository } from '../../repositories/TodoRepository'
import { Todo } from '../../models/Todo'

export class GetTodosByDateUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    return await this.todoRepository.getTodosByDate(targetDate)
  }
}
