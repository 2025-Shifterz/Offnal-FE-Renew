// 이 파일은 SQLite 데이터베이스 연결을 설정하고,
// 애플리케이션에 필요한 기본 테이블 (예: `todos`)을 생성하는 로직을 담당.
// 데이터 소스(SQLite)와 직접 통신하여 데이터베이스 인스턴스를 관리한다.
import SQLite from 'react-native-sqlite-storage'
import { openShifterzDB } from '../ShifterzDB'

SQLite.enablePromise(true)

// 데이터베이스 테이블을 초기화하는 함수 (앱 시작 시 한 번만 호출된다.)
export const createTodoTable = async (): Promise<void> => {
  const db = await openShifterzDB() // dbInstance를 통해 기존 연결을 재사용한다.

  await db.transaction(async tx => {
    await tx.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        type TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      []
    )

    console.log('Table "todos" created or already exists.')
  })
  return
}
