import { TodoRepository } from '../../repositories/TodoRepository'

export class DeleteAllTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute() {
    await this.todoRepository.deleteAllTodos()
  }
}
