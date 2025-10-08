import { TodoRepository } from '../../repositories/TodoRepository'

export class UpdateTodoStateCompleteUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number, completed: boolean): Promise<void> {
    await this.todoRepository.updateTodo(id, undefined, undefined, completed)
  }
}
