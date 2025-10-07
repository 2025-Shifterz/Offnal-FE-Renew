import { TodoRepository } from '../../repositories/TodoRepository'

export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number): Promise<void> {
    await this.todoRepository.deleteTodoById(id)
  }
}
