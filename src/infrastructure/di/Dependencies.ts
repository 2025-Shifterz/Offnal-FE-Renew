// 의존성 관리

import { MemoRepositoryImpl } from '../../data/impl/MemoRepositoryImpl'
import { TodoRepositoryImpl } from '../../data/impl/TodoRepositoryImpl'
import { AddTodoUseCase } from '../../domain/useCases/AddTodo'
import { DeleteTodoUseCase } from '../../domain/useCases/DeleteTodo'
import { GetMemosByDateUseCase } from '../../domain/useCases/GetMemosByDate'
import { GetTodosUseCase } from '../../domain/useCases/GetTodos'
import { GetTodosByDateUseCase } from '../../domain/useCases/GetTodosByDate'
import { TodoCompletionUseCase } from '../../domain/useCases/TodoCompletion'
import { MemoDao } from '../local/dao/MemoDao'
import { TodoDao } from '../local/dao/TodoDao'
import { CalendarService } from '../remote/api/CalendarService'
import { MemoService } from '../remote/api/MemoService'
import { ProfileService } from '../remote/api/ProfileService'
import { TodoService } from '../remote/api/TodoService'

// 1. 구체적인 데이터 소스 인스턴스 생성
const todoDao = new TodoDao()
const memoDao = new MemoDao()

export const calendarService = new CalendarService()
export const profileService = new ProfileService()
export const todoService = new TodoService()
export const memoService = new MemoService()
// export const homeService = new HomeService();
// export const fastAPIService = new FastAPIService();

// 2. 구체적인 리포지토리 구현체 인스턴스 생성 (TodoDao 주입)
export const todoRepository = new TodoRepositoryImpl(todoDao)
export const memoRepository = new MemoRepositoryImpl(memoDao)
// export const workCalendarRepository = new WorkCalendarRepositoryImpl(
//   calendarService,
// );
// export const homeRepository = new HomeRepositoryImpl(homeService);
// export const userRepository = new UserRepositoryImpl();

// 3. Use Case 인스턴스 생성 (repository 주입)
// --> 이제 addTodoUseCase 사용가능!
export const addTodoUseCase = new AddTodoUseCase(todoRepository)
export const getTodosUseCase = new GetTodosUseCase(todoRepository)
export const todoCompletionUseCase = new TodoCompletionUseCase(todoRepository)
export const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository)
// export const getHomeDataUseCase = new GetHomeDataUseCase(homeRepository);
export const getToDosByDate = new GetTodosByDateUseCase(todoRepository)
export const getMemosByDate = new GetMemosByDateUseCase(memoRepository)
