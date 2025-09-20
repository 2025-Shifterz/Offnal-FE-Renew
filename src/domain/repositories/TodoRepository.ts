import { Todo, TodoType } from "../entities/Todo";
import dayjs from "dayjs";

export interface TodoRepository {
  addTodo(todo: Omit<Todo, "id">): Promise<number>;

  getTodos(type: TodoType): Promise<Todo[]>;

  getToDosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]>;

  todoCompleted(id: number, completed: boolean, type: TodoType): Promise<void>;

  deleteTodo(id: number, type: TodoType): Promise<void>;
}
