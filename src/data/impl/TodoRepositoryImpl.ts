// domain 레이어의 TodoRepository 인터페이스를 구현한다.
// 이 구현체는 DAO (Data Access Object)를 사용하여 실제 데이터베이스 작업을 수행.
// 데이터 저장 및 조회 로직이 이곳에서 이루어진다.

import { Dayjs } from "dayjs";
import { Todo, TodoType } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";
import { TodoDao } from "../../infrastructure/local/dao/TodoDao";

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private todoDao: TodoDao) {}
  async getToDosByDate(targetDate: Dayjs): Promise<Todo[]> {
    return await this.todoDao.getTodosByDate(targetDate);
  }

  async addTodo(todo: Omit<Todo, "id">): Promise<number> {
    return await this.todoDao.addTodo(todo);
  }

  async getTodos(type: TodoType): Promise<Todo[]> {
    return await this.todoDao.getTodos(type);
  }

  async todoCompleted(
    id: number,
    completed: boolean,
    type: TodoType
  ): Promise<void> {
    return await this.todoDao.todoCompleted(id, completed, type);
  }

  async deleteTodo(id: number, type: TodoType): Promise<void> {
    return await this.todoDao.deleteTodo(id, type);
  }
}
