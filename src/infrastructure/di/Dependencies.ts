// 의존성 관리
import { MemoRepositoryImpl } from '../../data/impl/MemoRepositoryImpl'
import { TodoRepositoryImpl } from '../../data/impl/TodoRepositoryImpl'
import { OCRRepositoryImpl } from '../../data/impl/OCRRepositoryImpl'
import { CalendarRepositoryImpl } from '../../data/impl/CalendarRepositoryImpl'
import { HomeRepositoryImpl } from '../../data/impl/HomeRepositoryImpl'

import { CreateTodoUseCase } from '../../domain/usecases/todos/CreateTodoUseCase'
import { DeleteTodoUseCase } from '../../domain/usecases/todos/DeleteTodoByIdUseCase'
import { GetMemosByDateUseCase } from '../../domain/usecases/memos/GetMemosByDateUseCase'
import { GetAllTodosUseCase } from '../../domain/usecases/todos/GetAllTodosUseCase'
import { GetTodosByDateUseCase } from '../../domain/usecases/todos/GetTodosByDateUseCase'
import { UpdateTodoStateCompleteUseCase } from '../../domain/usecases/todos/UpdateTodoStateCompleteUseCase'

import { CreateMemoUseCase } from '../../domain/usecases/memos/CreateMemoUseCase'
import { DeleteMemoUseCase } from '../../domain/usecases/memos/DeleteMemoUseCase'
import { MemoDao } from '../local/dao/MemoDao'
import { TodoDao } from '../local/dao/TodoDao'

import { HomeService } from '../remote/api/HomeService'
import { OcrService } from '../remote/api/OcrService'
import { CalendarService } from '../remote/api/CalendarService'
import { MemoService } from '../remote/api/MemoService'
import { ProfileService } from '../remote/api/ProfileService'
import { TodoService } from '../remote/api/TodoService'
import { AuthService } from '../remote/api/AuthService'
import { UserRepositoryImpl } from '../../data/impl/UserRepositoryImpl'

// 1. 구체적인 데이터 소스 인스턴스 생성
const todoDao = new TodoDao()
const memoDao = new MemoDao()

const ocrService = new OcrService()
export const calendarService = new CalendarService()
export const homeService = new HomeService()
export const profileService = new ProfileService()
export const todoService = new TodoService()
export const memoService = new MemoService()
export const authService = new AuthService()

// 2. 구체적인 리포지토리 구현체 인스턴스 생성 (TodoDao 주입)
export const todoRepository = new TodoRepositoryImpl(todoDao)
export const memoRepository = new MemoRepositoryImpl(memoDao)
export const ocrRepository = new OCRRepositoryImpl(ocrService)
export const calendarRepository = new CalendarRepositoryImpl(calendarService)
export const homeRepository = new HomeRepositoryImpl(homeService)
export const userRepository = new UserRepositoryImpl()

// 3. Use Case 인스턴스 생성 (repository 주입)
export const addTodoUseCase = new CreateTodoUseCase(todoRepository)
export const getTodosUseCase = new GetAllTodosUseCase(todoRepository)
export const todoCompletionUseCase = new UpdateTodoStateCompleteUseCase(
  todoRepository
)
export const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository)

export const addMemoUseCase = new CreateMemoUseCase(memoRepository)
export const deleteMemoUseCase = new DeleteMemoUseCase(memoRepository)

export const getToDosByDate = new GetTodosByDateUseCase(todoRepository)
export const getMemosByDate = new GetMemosByDateUseCase(memoRepository)
