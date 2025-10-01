import dayjs from 'dayjs'
import { Todo } from '../../infrastructure/local/entities/TodoEntity'

export interface TodoRepository {
  createTodo(content: string, targetDate: dayjs.Dayjs): Promise<void>

  getAllTodos(): Promise<Todo[]>

  getTodoById(id: number): Promise<Todo | null>

  getTodosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]>

  updateTodo(
    id: number,
    content?: string,
    targetDate?: dayjs.Dayjs,
    completed?: boolean
  ): Promise<void>

  deleteTodoById(id: number): Promise<void>

  deleteAllTodos(): Promise<void>
}
