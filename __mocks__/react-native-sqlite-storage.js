const executeSql = jest.fn(async () => [[], []])

module.exports = {
  enablePromise: jest.fn(),
  openDatabase: jest.fn(async () => ({
    executeSql,
  })),
  __executeSql: executeSql,
}
