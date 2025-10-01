import { openShifterzDB } from '../ShifterzDB'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Todo } from '../entities/TodoEntity'

dayjs.extend(utc)

export class TodoDao {
  /**
   * ### async createTodo(content: string, targetDate: dayjs.Dayjs, type: string)
   *
   * 투두를 생성합니다 (Create).
   *
   * @param content 생성할 투두의 내용
   * @param targetDate 투두의 목표 날짜 (dayjs 객체)
   *
   * @return void
   */
  async createTodo(content: string, targetDate: dayjs.Dayjs): Promise<void> {
    const db = await openShifterzDB()

    try {
      const formattedTargetDate = targetDate.valueOf() // 밀리초 단위 타임스탬프로 변환

      const query = `INSERT INTO todos (content, targetDate) VALUES (?, ?);`
      const params = [content, formattedTargetDate]

      const [result] = await db.executeSql(query, params)
      const newId = result?.insertId || null

      if (!newId) {
        throw new Error('Failed to retrieve new todo ID after creation.')
      }

      console.log('Todo created with ID:', newId)
      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getTodoById(id: number)
   *
   * 특정 ID의 투두를 가져옵니다 (Read by ID).
   * 투두는 `todos` 테이블에서 조회됩니다.
   *
   * @param id 조회할 투두의 ID
   * @returns 해당 ID의 투두를 반환합니다.
   */
  async getTodoById(id: number): Promise<Todo | null> {
    const db = await openShifterzDB()

    try {
      const query = `SELECT * FROM todos WHERE id = ?;`
      const params = [id]

      const [result] = await db.executeSql(query, params)

      if (result.rows.length > 0) {
        return result.rows.item(0)
      } else {
        return null // 해당 ID의 투두가 없는 경우
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getAllTodos()
   *
   * 모든 투두를 가져옵니다 (Read All).
   * 투두는 `todos` 테이블에서 조회됩니다.
   *
   * @returns 모든 투두를 반환합니다.
   */
  async getAllTodos(): Promise<Todo[]> {
    const db = await openShifterzDB()

    try {
      const [result] = await db.executeSql('SELECT * FROM todos;')
      const todos: Todo[] = []

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i)
        todos.push(item)
      }

      return todos
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getTodosByDate(targetDate: dayjs.Dayjs)
   *
   * 특정 날짜에 해당하는 투두를 가져옵니다 (Read by Date).
   * 투두는 `todos` 테이블에서 조회됩니다.
   *
   * @param targetDate 조회할 투두의 목표 날짜 (dayjs 객체)
   * @returns 해당 날짜의 모든 투두를 반환합니다.
   */
  async getTodosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    const db = await openShifterzDB()

    try {
      const startOf = targetDate.startOf('day').valueOf() // 밀리초 단위 타임스탬프로 변환
      const endOf = targetDate.endOf('day').valueOf() // 밀리초 단위 타임스탬프로 변환

      const query = `SELECT * FROM todos WHERE targetDate BETWEEN ? AND ?;`
      const params = [startOf, endOf]

      const [result] = await db.executeSql(query, params)
      const todos: Todo[] = []

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i)
        todos.push(item)
      }

      return todos
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async updateTodo(id: number, content?: string, completed?: boolean, targetDate?: dayjs.Dayjs)
   *
   * 특정 ID의 투두를 업데이트합니다 (Update).
   * content, completed, targetDate 중 하나 또는 그 이상을 업데이트할 수 있습니다.
   *
   * @param id 업데이트할 투두의 ID
   * @param content (선택) 업데이트할 새로운 내용
   * @param completed (선택) 업데이트할 완료 상태
   * @param targetDate (선택) 업데이트할 새로운 목표 날짜 (dayjs 객체)
   *
   * @returns void
   */
  async updateTodo(
    id: number,
    content?: string,
    completed?: boolean,
    targetDate?: dayjs.Dayjs
  ): Promise<void> {
    const db = await openShifterzDB()

    try {
      const fieldsToUpdate: string[] = []
      const params: (string | number)[] = []

      if (content !== undefined) {
        fieldsToUpdate.push('content = ?')
        params.push(content)
      }

      if (completed !== undefined) {
        fieldsToUpdate.push('completed = ?')
        params.push(completed ? 1 : 0) // boolean을 INTEGER로 변환
      }

      if (targetDate !== undefined) {
        fieldsToUpdate.push('targetDate = ?')
        params.push(targetDate.valueOf()) // 밀리초 단위 타임스탬프로 변환
      }

      if (fieldsToUpdate.length === 0) {
        throw new Error('No fields provided to update.')
      }

      const query = `UPDATE todos SET ${fieldsToUpdate.join(', ')} WHERE id = ?;`
      params.push(id)

      await db.executeSql(query, params)
      console.log(`Todo with ID ${id} updated successfully.`)
      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async deleteTodoById(id: number)
   *
   * 특정 ID의 투두를 삭제합니다 (Delete).
   *
   * @param id 삭제할 Todo의 ID
   * @returns void
   */
  async deleteTodoById(id: number): Promise<void> {
    const db = await openShifterzDB()

    try {
      const query = `DELETE FROM todos WHERE id = ?;`
      const params = [id]

      await db.executeSql(query, params)
      console.log(`Todo with ID ${id} deleted successfully.`)
      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async deleteAllTodos()
   *
   * 모든 투두를 삭제합니다 (Delete All).
   *
   * @returns void
   */
  async deleteAllTodos(): Promise<void> {
    const db = await openShifterzDB()

    try {
      const query = `DELETE FROM todos;`
      await db.executeSql(query)
      console.log('All todos deleted successfully.')
      return
    } catch (error) {
      throw error
    }
  }
}
