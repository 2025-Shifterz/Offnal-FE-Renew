import { TodoType } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class TodoCompletionUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number, completed: boolean, type: TodoType): Promise<void> {
    await this.todoRepository.todoCompleted(id, completed, type);
  }
}
