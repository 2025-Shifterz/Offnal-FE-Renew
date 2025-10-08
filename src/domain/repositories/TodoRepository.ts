import dayjs from 'dayjs'
import { TodoEntity } from '../../data/models/TodoEntity'

export interface TodoRepository {
  createTodo(content: string, targetDate: dayjs.Dayjs): Promise<void>

  getAllTodos(): Promise<TodoEntity[]>

  getTodoById(id: number): Promise<TodoEntity | null>

  getTodosByDate(targetDate: dayjs.Dayjs): Promise<TodoEntity[]>

  updateTodo(
    id: number,
    content?: string,
    targetDate?: dayjs.Dayjs,
    completed?: boolean
  ): Promise<void>

  deleteTodoById(id: number): Promise<void>

  deleteAllTodos(): Promise<void>
}
