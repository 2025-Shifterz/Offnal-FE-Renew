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
import { MemberService } from '../remote/api/MemberService'
import { TodoService } from '../remote/api/TodoService'
import { AuthService } from '../remote/api/AuthService'
import { MemberRepositoryImpl as MemberRepositoryImpl } from '../../data/impl/MemberRepositoryImpl'
import { UpdateMemoUseCase } from '../../domain/usecases/memos/UpdateMemoUseCase'
import { GetMemoByIdUseCase } from '../../domain/usecases/memos/GetMemoByIdUseCase'
import { OrganizationService } from '../remote/api/OrganizationService'
import { OrganizationRepositoryImpl } from '../../data/impl/OrganizationRepositoryImpl'
import { UpdateTodoUseCase } from '../../domain/usecases/todos/UpdateTodoUseCase'
import { TeamCalendarRepositoryImpl } from '../../data/impl/TeamCalendarRepositoryImpl'
import { TeamCalendarService } from '../remote/api/TeamCalendarService'
import { ScheduleInfoService } from '../remote/api/ScheduleInfoService'
import { ScheduleInfoRepositoryImpl } from '../../data/impl/ScheduleInfoRepositoryImpl'
import { HealthRepositoryImpl } from '../../data/impl/HealthRepositoryImpl'
import { HolidayDao } from '../local/dao/HolidayDao'
import { OpenApiService } from '../remote/api/OpenApiService'
import { HolidayRepositoryImpl } from '../../data/impl/HolidayRepositoryImpl'
import { Platform } from 'react-native'
import { IosHealthDataSource } from '../dataSource/IosHealthDataSource'
import { AndroidHealthDataSource } from '../dataSource/AndroidHealthDataSource'
import { DeleteAllTodosUseCase } from '../../domain/usecases/todos/DeleteAllTodosUseCase'
import { GetHolidayDateSetUseCase } from '../../domain/usecases/holiday/GetHolidayDateSetUseCase'

// 1. 구체적인 데이터 소스 인스턴스 생성
const todoDao = new TodoDao()
const memoDao = new MemoDao()
const holidayDao = new HolidayDao()

export const ocrService = new OcrService()
export const organizationService = new OrganizationService()
export const calendarService = new CalendarService()
export const scheduleInfoService = new ScheduleInfoService()
export const homeService = new HomeService()
export const memberService = new MemberService()
export const todoService = new TodoService()
export const memoService = new MemoService()
export const authService = new AuthService()
export const teamCalendarService = new TeamCalendarService()
export const openApiService = new OpenApiService()

// 2. 구체적인 리포지토리 구현체 인스턴스 생성 (TodoDao 주입)
export const todoRepository = new TodoRepositoryImpl(todoDao)
export const memoRepository = new MemoRepositoryImpl(memoDao)
export const ocrRepository = new OCRRepositoryImpl(ocrService)
export const organizationRepository = new OrganizationRepositoryImpl(
  organizationService
)
export const calendarRepository = new CalendarRepositoryImpl(calendarService)
export const teamCalendarRepository = new TeamCalendarRepositoryImpl(
  teamCalendarService
)
export const scheduleInfoRepository = new ScheduleInfoRepositoryImpl(
  scheduleInfoService
)
export const homeRepository = new HomeRepositoryImpl(homeService)
export const memberRepository = new MemberRepositoryImpl(memberService)
export const holidayRepository = new HolidayRepositoryImpl(
  holidayDao,
  openApiService
)

const dataSource =
  Platform.OS === 'ios'
    ? new IosHealthDataSource()
    : Platform.OS === 'android'
      ? new AndroidHealthDataSource()
      : (() => {
          throw new Error('Unsupported platform for HealthDataSource')
        })() // 다른 플랫폼에서는 빈 객체 반환

export const healthRepository = new HealthRepositoryImpl(dataSource)

// 3. Use Case 인스턴스 생성 (repository 주입)
export const addTodoUseCase = new CreateTodoUseCase(todoRepository)
export const getTodosUseCase = new GetAllTodosUseCase(todoRepository)
export const todoCompletionUseCase = new UpdateTodoStateCompleteUseCase(
  todoRepository
)
export const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository)
export const deleteAllTodosUseCase = new DeleteAllTodosUseCase(todoRepository)
export const updateTodoUseCase = new UpdateTodoUseCase(todoRepository)

export const addMemoUseCase = new CreateMemoUseCase(memoRepository)
export const deleteMemoUseCase = new DeleteMemoUseCase(memoRepository)

export const getToDosByDateUseCase = new GetTodosByDateUseCase(todoRepository)
export const getMemosByDateUseCase = new GetMemosByDateUseCase(memoRepository)
export const getMemoByIdUseCase = new GetMemoByIdUseCase(memoRepository)
export const updateMemoUseCase = new UpdateMemoUseCase(memoRepository)
export const getHolidayDateSetUseCase = new GetHolidayDateSetUseCase(
  holidayRepository
)
