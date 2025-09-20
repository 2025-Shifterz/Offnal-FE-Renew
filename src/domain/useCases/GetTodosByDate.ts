import { Todo, TodoType } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";
import dayjs from "dayjs";

export class GetTodosByDateUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    return await this.todoRepository.getToDosByDate(targetDate);
  }
}
