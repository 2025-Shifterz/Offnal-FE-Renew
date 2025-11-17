import { Dayjs } from 'dayjs'
import { TodoRepository } from '../../repositories/TodoRepository'

export class UpdateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  execute(
    id: number,
    content?: string,
    targetDate?: Dayjs,
    isCompleted?: boolean
  ): Promise<void> {
    return this.todoRepository.updateTodo(id, content, targetDate, isCompleted)
  }
}
