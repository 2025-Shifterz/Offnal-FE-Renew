import { TodoType } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number, type: TodoType): Promise<void> {
    await this.todoRepository.deleteTodo(id, type);
  }
}
