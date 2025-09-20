import { Todo, TodoType } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class GetTodosUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(type: TodoType): Promise<Todo[]> {
    console.log("GetTodosUseCase type:", type);
    return await this.todoRepository.getTodos(type);
  }
}
