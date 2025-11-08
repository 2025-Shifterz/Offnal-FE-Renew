import SQLite from 'react-native-sqlite-storage'
import { openShifterzDB } from './ShifterzDB'

SQLite.enablePromise(true)

// 데이터베이스 테이블을 초기화하는 함수 (앱 시작 시 한 번만 호출된다.)
export const initializeDataBaseTables = async (): Promise<void> => {
  try {
    const db = await openShifterzDB()

    const sqlQueries = [
      `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          targetDate INTEGER NOT NULL,
          createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      `CREATE TRIGGER IF NOT EXISTS update_todos_updatedAt
        AFTER UPDATE ON todos
        FOR EACH ROW
        BEGIN
          UPDATE todos SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
        END;`,
      `CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        targetDate INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      `CREATE TRIGGER IF NOT EXISTS update_memos_updatedAt
          AFTER UPDATE ON memos
          FOR EACH ROW
          BEGIN
            UPDATE memos SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
          END;`,
    ]

    sqlQueries.forEach(async query => {
      await db.executeSql(query)
    })

    console.log('Database tables initialized!')
  } catch (error) {
    console.error('Error opening database: ', error)
  }
}
