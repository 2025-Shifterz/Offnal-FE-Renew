import { toTodoDomain } from '../../mappers/TodoMapper'
import { Todo } from '../../models/Todo'
import { TodoRepository } from '../../repositories/TodoRepository'

export class GetTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.getAllTodos()
      const result = todos.map(toTodoDomain)

      return result
    } catch (error) {
      throw error
    }
  }
}
