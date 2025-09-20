import { openShifterzDB } from "../ShifterzDB";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Todo } from "../../../domain/entities/Todo";

dayjs.extend(utc);

export class MemoDao {
  /**
   * 모든 'memo' 타입의 Todo 항목을 가져옵니다 (Read All).
   * @returns 모든 'memo' 항목 배열
   */
  async getAllMemos(): Promise<Todo[]> {
    const db = await openShifterzDB();
    try {
      const [result] = await db.executeSql(
        "SELECT * FROM todos WHERE type = ?;",
        ["memo"]
      );
      const memos: Todo[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i);
        item.completed = item.completed === 1;
        memos.push(item);
      }
      console.log("All memos fetched:", memos);
      return memos;
    } catch (error) {
      console.error("Error getting all memos:", error);
      throw error;
    }
  }

  /**
   * 새로운 'memo' 타입의 Todo 항목을 생성합니다 (Create).
   * @param memoText 생성할 메모의 텍스트
   * @param targetDate (선택 사항) 메모가 생성될 날짜 (dayjs 객체). 지정하지 않으면 현재 시점.
   * @returns 생성된 Memo 항목 (ID 포함)
   */
  async createMemo(memoText: string, targetDate?: dayjs.Dayjs): Promise<Todo> {
    const db = await openShifterzDB();
    try {
      let query: string;
      let params: any[];

      if (targetDate) {
        const formattedCreatedAt = targetDate.format("YYYY-MM-DD HH:mm:ss");
        query = `
          INSERT INTO todos (text, completed, type, createdAt)
          VALUES (?, ?, ?, ?);
        `;
        params = [memoText, 0, "memo", formattedCreatedAt];
      } else {
        query = `
          INSERT INTO todos (text, completed, type)
          VALUES (?, ?, ?);
        `;
        params = [memoText, 0, "memo"];
      }

      const [result] = await db.executeSql(query, params);

      const newId = result?.insertId || null;

      if (!newId) {
        throw new Error("Failed to retrieve new memo ID after creation.");
      }

      const [insertedRowResult] = await db.executeSql(
        "SELECT * FROM todos WHERE id = ?",
        [newId]
      );
      const createdMemo = insertedRowResult.rows.item(0);

      createdMemo.completed = createdMemo.completed === 1;

      console.log("Memo created:", createdMemo);
      return createdMemo;
    } catch (error) {
      console.error("Error creating memo:", error);
      throw error;
    }
  }

  /**
   * 특정 날짜에 생성된 'memo' 타입의 Todo 항목을 가져옵니다 (Read by Date).
   * @param targetDate 조회할 날짜 (dayjs 객체)
   * @returns 해당 날짜에 생성된 'memo' 항목 배열
   */
  async getMemosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    const db = await openShifterzDB();
    try {
      const startOfDayLocal = targetDate.startOf("day");
      const endOfDayLocal = targetDate.endOf("day");

      const startOfDayUTC = startOfDayLocal.utc().format("YYYY-MM-DD HH:mm:ss");
      const endOfDayUTC = endOfDayLocal.utc().format("YYYY-MM-DD HH:mm:ss");

      let query =
        "SELECT * FROM todos WHERE type = ? AND createdAt BETWEEN ? AND ?";
      const params: any[] = ["memo", startOfDayUTC, endOfDayUTC];

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
      throw error;
    }
  }

  /**
   * 'memo' 항목을 ID로 업데이트합니다 (Update).
   * 'text'와 'completed'만 업데이트 가능하며, 'type'은 'memo'로 고정됩니다.
   * @param id 업데이트할 'memo'의 ID
   * @param updates 업데이트할 필드 객체 (text?: string, completed?: boolean)
   * @returns 업데이트 성공 여부 (boolean)
   */
  async updateMemo(
    id: number,
    updates: { text?: string; completed?: boolean }
  ): Promise<boolean> {
    const db = await openShifterzDB();
    try {
      const setParts: string[] = [];
      const params: any[] = [];

      if (updates.text !== undefined) {
        setParts.push("text = ?");
        params.push(updates.text);
      }
      if (updates.completed !== undefined) {
        setParts.push("completed = ?");
        params.push(updates.completed ? 1 : 0);
      }

      if (setParts.length === 0) {
        console.warn("No valid fields provided for update.");
        return false;
      }

      const query = `UPDATE todos SET ${setParts.join(
        ", "
      )} WHERE id = ? AND type = ?;`;
      params.push(id, "memo");

      const [result] = await db.executeSql(query, params);

      const success = (result?.rowsAffected || 0) > 0;
      console.log(`Memo with ID ${id} updated:`, success);
      return success;
    } catch (error) {
      console.error(`Error updating memo with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * 'memo' 항목을 ID로 삭제합니다 (Delete).
   * @param id 삭제할 'memo'의 ID
   * @returns 삭제 성공 여부 (boolean)
   */
  async deleteMemo(id: number): Promise<boolean> {
    const db = await openShifterzDB();
    try {
      const [result] = await db.executeSql(
        "DELETE FROM todos WHERE id = ? AND type = ?;",
        [id, "memo"]
      );

      const success = (result?.rowsAffected || 0) > 0;
      console.log(`Memo with ID ${id} deleted:`, success);
      return success;
    } catch (error) {
      console.error(`Error deleting memo with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * 모든 'memo' 항목을 삭제합니다 (Danger Zone!).
   * @returns 삭제 성공 여부 (void로 변경, Promise<boolean> 대신)
   */
  async deleteAllMemos(): Promise<void> {
    const db = await openShifterzDB();
    try {
      const [result] = await db.executeSql(
        "DELETE FROM todos WHERE type = ?;",
        ["memo"]
      );
      const success = (result?.rowsAffected || 0) >= 0;
      console.log("All memos deleted:", success);
    } catch (error) {
      console.error("Error deleting all memos:", error);
      throw error;
    }
  }
}
