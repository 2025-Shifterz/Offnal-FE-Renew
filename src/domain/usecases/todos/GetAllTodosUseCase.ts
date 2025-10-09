import { toTodoDomain } from '../../mappers/TodoMapper'
import { Todo } from '../../models/Todo'
import { TodoRepository } from '../../repositories/TodoRepository'

export class GetAllTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    const todos = await this.todoRepository.getAllTodos()
    const result = todos.map(toTodoDomain)

    return result
  }
}
