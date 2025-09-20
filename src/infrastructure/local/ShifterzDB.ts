import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

// 데이터베이스를 열고 인스턴스를 반환하는 함수
export const openShifterzDB = async (): Promise<SQLite.SQLiteDatabase> => {
  // 데이터베이스를 한 번만 열고 재사용하기
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabase({
    name: "myDatabase.db",
    location: "default",
  });

  console.log("DB opened!");
  dbInstance = db;
  return db;
};
