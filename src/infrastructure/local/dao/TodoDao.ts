import { openShifterzDB } from "../ShifterzDB";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Todo, TodoType } from "../../../domain/entities/Todo";

dayjs.extend(utc);

export class TodoDao {
  // todo 추가하기
  async addTodo(todo: Omit<Todo, "id">): Promise<number> {
    const db = await openShifterzDB(); // 데이터베이스 초기화 및 가져오기
    try {
      const createdAtStr = dayjs(todo.createdAt)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      const [result] = await db.executeSql(
        "INSERT INTO todos (text, completed, type, createdAt) VALUES (?, ?, ?, ?)",
        [todo.text, todo.completed, todo.type, createdAtStr] // 새로운 할 일은 기본적으로 미완료 상태 (0)
      );
      console.log(`Todo "${todo.text}" added with ID: ${result.insertId}`);
      return result.insertId;
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  }

  /**
   * 특정 날짜에 생성된 'todo' 타입의 Todo 항목을 가져옵니다 (Read by Date).
   * @param targetDate 조회할 날짜 (dayjs 객체)
   * @returns 해당 날짜에 생성된 'memo' 항목 배열
   */
  async getTodosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    const db = await openShifterzDB();
    try {
      const startOfDayLocal = targetDate.startOf("day");
      const endOfDayLocal = targetDate.endOf("day");

      const startOfDayUTC = startOfDayLocal.utc().format("YYYY-MM-DD HH:mm:ss");
      const endOfDayUTC = endOfDayLocal.utc().format("YYYY-MM-DD HH:mm:ss");

      let query =
        "SELECT * FROM todos WHERE type = ? AND createdAt BETWEEN ? AND ?";
      const params: any[] = ["todo", startOfDayUTC, endOfDayUTC];

      const [result] = await db.executeSql(query, params);
      const memos: Todo[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i);
        // DB의 0/1을 boolean으로 변환
        item.completed = item.completed === 1;
        memos.push(item);
      }
      console.log(
        `Memos for date '${targetDate.format("YYYY-MM-DD")}':`,
        memos
      );
      return memos;
    } catch (error) {
      console.error(
        `Error getting memos by date '${targetDate.format("YYYY-MM-DD")}':`,
        error
      );
      return [];
    }
  }

  // 모든 todos 가져오기
  async getTodos(type: TodoType): Promise<Todo[]> {
    const db = await openShifterzDB();
    try {
      const [res] = await db.executeSql("SELECT * FROM todos");
      for (let i = 0; i < res.rows.length; i++) {
        const row = res.rows.item(i);
        console.log(
          `row.type = ${row.type}, input type = ${type}, match: ${
            row.type === type
          }`
        );
      }

      const [result] = await db.executeSql(
        "SELECT * FROM todos WHERE type = ?",
        [type]
      );
      const todos: Todo[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        todos.push(result.rows.item(i));
      }
      console.log("getTodos called with type:", type);

      console.log("All todos:", todos);
      return todos;
    } catch (error) {
      console.error("Error getting todos:", error);
      throw error;
    }
  }

  // todo 완료 상태 바꾸기
  async todoCompleted(
    id: number,
    completed: boolean,
    type: TodoType
  ): Promise<void> {
    const db = await openShifterzDB();
    try {
      await db.executeSql(
        "UPDATE todos SET completed = ? WHERE id = ? AND type = ?",
        [completed ? 1 : 0, id, type] // true면 1, false면 0으로 저장
      );
      console.log(
        `Todo with ID ${id} updated to completed: ${completed}, type: ${type}`
      );
    } catch (error) {
      console.error("Error toggling todo completion:", error);
      throw error;
    }
  }

  // todo 삭제하기
  async deleteTodo(id: number, type: TodoType): Promise<void> {
    const db = await openShifterzDB();

    try {
      await db.executeSql("DELETE FROM todos WHERE id = ? AND type = ?", [
        id,
        type,
      ]);
      console.log(`Todo with ID ${id} and type ${type} deleted.`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
}
