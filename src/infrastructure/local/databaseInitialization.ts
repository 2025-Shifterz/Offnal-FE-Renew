import SQLite from 'react-native-sqlite-storage'
import { openDatabase } from './database'

SQLite.enablePromise(true)

// 데이터베이스 테이블을 초기화하는 함수 (앱 시작 시 한 번만 호출된다.)
export const initializeDataBaseTables = async (): Promise<void> => {
  try {
    const db = await openDatabase()

    await migrateAutoAlarmTableIfNeeded(db)

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
      `CREATE TABLE IF NOT EXISTS holiday_cache_meta (
        year TEXT PRIMARY KEY,
        totalCount INTEGER NOT NULL,
        fetchedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      `CREATE TABLE IF NOT EXISTS holiday_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        dateName TEXT NOT NULL,
        locdate INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        UNIQUE(year, locdate)
      );`,
      `CREATE INDEX IF NOT EXISTS idx_holiday_items_year ON holiday_items(year);`,
      `CREATE INDEX IF NOT EXISTS idx_holiday_items_locdate ON holiday_items(locdate);`,
      `CREATE TRIGGER IF NOT EXISTS update_holiday_items_updatedAt
          AFTER UPDATE ON holiday_items
          FOR EACH ROW
          BEGIN
            UPDATE holiday_items SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
          END;`,
      `CREATE TABLE IF NOT EXISTS auto_alarms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hour INTEGER NOT NULL,
        minute INTEGER NOT NULL,
        workTypeTitle TEXT NOT NULL,
        weekdaysMask INTEGER NOT NULL DEFAULT 0,
        isEnabled INTEGER NOT NULL DEFAULT 1,
        isHolidayDisabled INTEGER NOT NULL DEFAULT 0,
        isSnoozeEnabled INTEGER NOT NULL DEFAULT 0,
        snoozeIntervalMinutes INTEGER NOT NULL DEFAULT 0,
        snoozeRepeatCount INTEGER NOT NULL DEFAULT 0,
        nextTriggerAtMillis INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      );`,
      `CREATE INDEX IF NOT EXISTS idx_auto_alarms_nextTriggerAtMillis ON auto_alarms(nextTriggerAtMillis);`,
      `CREATE INDEX IF NOT EXISTS idx_auto_alarms_isEnabled ON auto_alarms(isEnabled);`,
      `CREATE TRIGGER IF NOT EXISTS update_auto_alarms_updatedAt
          AFTER UPDATE ON auto_alarms
          FOR EACH ROW
          BEGIN
            UPDATE auto_alarms SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = OLD.id;
          END;`,
    ]

    for (const query of sqlQueries) {
      await db.executeSql(query)
    }

    await ensureAutoAlarmSnoozeColumn(db)

    console.log('Database tables initialized!')
  } catch (error) {
    console.error('Error opening database: ', error)
  }
}

const autoAlarmBaseColumns = [
  'hour',
  'minute',
  'workTypeTitle',
  'weekdaysMask',
  'isEnabled',
  'isHolidayDisabled',
  'snoozeIntervalMinutes',
  'snoozeRepeatCount',
  'nextTriggerAtMillis',
  'createdAt',
  'updatedAt',
] as const

const getTableColumns = async (
  db: SQLite.SQLiteDatabase,
  tableName: string
): Promise<string[]> => {
  const [result] = await db.executeSql(`PRAGMA table_info(${tableName});`)
  const columns: string[] = []

  for (let index = 0; index < result.rows.length; index += 1) {
    columns.push(result.rows.item(index).name)
  }

  return columns
}

const migrateAutoAlarmTableIfNeeded = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  const columns = await getTableColumns(db, 'auto_alarms')

  if (columns.length === 0) {
    return
  }

  const hasCompatibleSchema = autoAlarmBaseColumns.every(column =>
    columns.includes(column)
  )

  if (hasCompatibleSchema) {
    return
  }

  await db.executeSql('DROP TABLE IF EXISTS auto_alarms;')
}

const ensureAutoAlarmSnoozeColumn = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  const [result] = await db.executeSql('PRAGMA table_info(auto_alarms);')
  const hasSnoozeEnabledColumn = Array.from({
    length: result.rows.length,
  }).some((_, index) => result.rows.item(index).name === 'isSnoozeEnabled')

  if (hasSnoozeEnabledColumn) {
    return
  }

  await db.executeSql(
    'ALTER TABLE auto_alarms ADD COLUMN isSnoozeEnabled INTEGER NOT NULL DEFAULT 0;'
  )
}
