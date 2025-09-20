import { Todo, TodoType } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

// 나는 할 일 추가 기능을 수행할 건데, 데이터를 저장하고 불러오는 일은 TodoRepository 한테 시킬거야.
export class AddTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(
    text: string,
    type: TodoType,
    createdAt: string
  ): Promise<number> {
    const newTodo: Todo = { id: 0, text, completed: false, type, createdAt }; // ID는 저장 시 DB에서 할당
    return await this.todoRepository.addTodo(newTodo);
  }
}
