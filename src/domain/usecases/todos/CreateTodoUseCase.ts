import dayjs from 'dayjs'
import { TodoRepository } from '../../repositories/TodoRepository'

export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(content: string, targetDate: dayjs.Dayjs): Promise<void> {
    return await this.todoRepository.createTodo(content, targetDate)
  }
}
