// Jest 환경에서는 네이티브 모듈이 없으므로 react-native-sqlite-storage 함수를 그대로 쓰면 에러
// 테스트 중 DB 관련 코드 호출 시 실제 DB 없이도 안전하게 테스트 가능

const transactionMock = jest.fn(() => ({
  executeSql: jest.fn(),
}))

const openDatabaseMock = jest.fn(() => ({
  transaction: transactionMock,
  close: jest.fn(),
}))

const SQLiteMock = {
  enablePromise: jest.fn(), // enablePromise 함수도 mock
  openDatabase: openDatabaseMock,
}

export default SQLiteMock
