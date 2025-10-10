import { Todo } from '../../models/Todo'
import { TodoRepository } from '../../repositories/TodoRepository'

export class GetAllTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.getAllTodos()
  }
}
