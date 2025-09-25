// 실제 데이터베이스나 실제 useCase를 호출하지 않고, mock으로 대체한 뒤 UI 동작을 검증한다.
export const getTodosUseCase = {
  execute: jest.fn(() => Promise.resolve([])),
}

export const addTodoUseCase = {
  execute: jest.fn(() => Promise.resolve()),
}

export const todoCompletionUseCase = {
  execute: jest.fn(() => Promise.resolve()),
}

export const deleteTodoUseCase = {
  execute: jest.fn(() => Promise.resolve()),
}
