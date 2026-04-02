import SQLite from 'react-native-sqlite-storage'

SQLite.enablePromise(true)

let dbInstance: SQLite.SQLiteDatabase | null = null

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance
  }

  const db = await SQLite.openDatabase({
    name: 'myDatabase.db',
    location: 'default',
  })

  dbInstance = db
  return db
}
