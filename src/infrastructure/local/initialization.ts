import SQLite from 'react-native-sqlite-storage'
import { openShifterzDB } from './ShifterzDB'

SQLite.enablePromise(true)

// 데이터베이스 테이블을 초기화하는 함수 (앱 시작 시 한 번만 호출된다.)
export const initializeDataBaseTables = async (): Promise<void> => {
  const db = await openShifterzDB()

  await db.transaction(async tx => {
    // Todo 테이블을 생성합니다.
    // 이때 createdAt 필드의 DEFAULT 값을 밀리초 단위로 저장합니다.
    // 이때 updatedAt 필드의 DEFAULT 값을 밀리초 단위로 저장합니다.
    // 왜냐면 Date.now()가 밀리초 단위이기 때문입니다.
    await tx.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        targetDate INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      []
    )

    // Todo 테이블의 updatedAt 필드를 자동으로 갱신하는 트리거를 생성합니다.
    // 이때 updatedAt 필드의 값을 밀리초 단위로 저장합니다.
    await tx.executeSql(
      `CREATE TRIGGER IF NOT EXISTS update_todos_updatedAt
       AFTER UPDATE ON todos
       FOR EACH ROW
       BEGIN
           UPDATE todos SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
       END;`,
      []
    )

    // Memo 테이블을 생성합니다.
    // 이때 createdAt 필드의 DEFAULT 값을 밀리초 단위로 저장합니다.
    // 이때 updatedAt 필드의 DEFAULT 값을 밀리초 단위로 저장합니다.
    // 왜냐면 Date.now()가 밀리초 단위이기 때문입니다.
    await tx.executeSql(
      `CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        targetDate INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      []
    )

    // Memo 테이블의 updatedAt 필드를 자동으로 갱신하는 트리거를 생성합니다.
    // 이때 updatedAt 필드의 값을 밀리초 단위로 저장합니다.
    await tx.executeSql(
      `CREATE TRIGGER IF NOT EXISTS update_memos_updatedAt
       AFTER UPDATE ON memos
       FOR EACH ROW
       BEGIN
           UPDATE memos SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
       END;`,
      []
    )

    console.log('Database tables and triggers created or already exist.')
  })
  return
}
