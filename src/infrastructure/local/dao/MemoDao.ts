import { openShifterzDB } from '../ShifterzDB'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Memo } from '../entities/MemoEntity'

dayjs.extend(utc)

export class MemoDao {
  /**
   * ### async createMemo(content: string, targetDate: dayjs.Dayjs)
   *
   * memo를 생성합니다 (Create).
   *
   * @param content 생성할 메모의 내용
   * @param targetDate 메모의 목표 날짜 (dayjs 객체)
   *
   * @return void
   */
  async createMemo(content: string, targetDate: dayjs.Dayjs): Promise<void> {
    const db = await openShifterzDB()

    try {
      const formattedTargetDate = targetDate.valueOf() // 밀리초 단위 타임스탬프로 변환

      const query = `INSERT INTO memos (content, targetDate) VALUES (?, ?);`
      const params = [content, formattedTargetDate]

      const [result] = await db.executeSql(query, params)
      const newId = result?.insertId || null

      if (!newId) {
        throw new Error('Failed to retrieve new memo ID after creation.')
      }

      console.log('Memo created with ID:', newId)
      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getAllMemos()
   *
   * 모든 메모를 가져옵니다 (Read All).
   * 메모는 `memos` 테이블에서 조회됩니다.
   *
   * @returns 모든 메모를 반환합니다.
   */
  async getAllMemos(): Promise<Memo[]> {
    const db = await openShifterzDB()

    try {
      const [result] = await db.executeSql('SELECT * FROM memos;')
      const memos: Memo[] = []

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i)

        memos.push(item)
      }

      return memos
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getMemoById(id: number)
   *
   * 특정 ID의 메모를 가져옵니다 (Read by ID).
   *
   * @param id 조회할 메모의 ID
   *
   * @returns 해당 ID의 메모를 반환합니다. 없으면 null 반환.
   */
  async getMemoById(id: number): Promise<Memo | null> {
    const db = await openShifterzDB()

    try {
      const query = `SELECT * FROM memos WHERE id = ?;`
      const params = [id]

      const [result] = await db.executeSql(query, params)

      if (result.rows.length > 0) {
        return result.rows.item(0)
      } else {
        console.warn(`No memo found with ID ${id}.`)
        return null
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async getMemosByDate(targetDate: dayjs.Dayjs)
   *
   * 특정 일자의 메모들을 가져옵니다 (Read by Date).
   *
   * @param targetDate 조회할 날짜 (dayjs 객체)
   *
   * @returns 해당 날짜에 생성된 메모 배열
   */
  async getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]> {
    const db = await openShifterzDB()

    try {
      const startOf = targetDate.startOf('day').valueOf() // 밀리초 단위 타임스탬프로 변환 (시작)
      const endOf = targetDate.endOf('day').valueOf() // 밀리초 단위 타임스탬프로 변환 (끝)

      const query = `SELECT * FROM memos WHERE targetDate BETWEEN ? AND ?;`
      const params = [startOf, endOf]

      const [result] = await db.executeSql(query, params)
      const memos: Memo[] = []

      for (let i = 0; i < result.rows.length; i++) {
        const item = result.rows.item(i)
        memos.push(item)
      }

      return memos
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async updateMemo(id: number, content?: string, targetDate?: dayjs.Dayjs)
   *
   * 특정 ID의 메모를 업데이트합니다 (Update).
   * content와 targetDate 중 하나 또는 둘 다 업데이트할 수 있습니다.
   *
   * @param id 업데이트할 메모의 ID
   * @param content (선택) 업데이트할 새로운 내용
   * @param targetDate (선택) 업데이트할 새로운 목표 날짜 (dayjs 객체)
   *
   * @returns void
   */
  async updateMemo(
    id: number,
    content?: string,
    targetDate?: dayjs.Dayjs
  ): Promise<void> {
    const db = await openShifterzDB()

    try {
      const setParts: string[] = []
      const params: (string | number)[] = []

      if (content !== undefined) {
        setParts.push('content = ?')
        params.push(content)
      }

      if (targetDate !== undefined) {
        setParts.push('targetDate = ?')
        params.push(targetDate.valueOf()) // 밀리초 단위 타임스탬프로 변환
      }

      if (setParts.length === 0) {
        console.warn('No valid fields provided for update.')
        return
      }

      const query = `UPDATE memos SET ${setParts.join(', ')} WHERE id = ?;`
      params.push(id)

      const [result] = await db.executeSql(query, params)
      const rowsAffected = result?.rowsAffected || 0

      if (rowsAffected === 0) {
        console.warn(`No memo found with ID ${id} to update.`)
      } else {
        console.log(`Memo with ID ${id} updated.`)
      }

      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async deleteMemo(id: number)
   *
   * 특정 ID의 메모를 삭제합니다 (Delete).
   *
   * @param id 삭제할 메모의 ID
   *
   * @returns void
   */
  async deleteMemo(id: number): Promise<void> {
    const db = await openShifterzDB()

    try {
      const query = `DELETE FROM memos WHERE id = ?;`
      const params = [id]

      const [result] = await db.executeSql(query, params)
      const rowsAffected = result?.rowsAffected || 0

      if (rowsAffected === 0) {
        console.warn(`No memo found with ID ${id} to delete.`)
      } else {
        console.log(`Memo with ID ${id} deleted.`)
      }

      return
    } catch (error) {
      throw error
    }
  }

  /**
   * ### async deleteAllMemos()
   *
   * 모든 메모를 삭제합니다 (Danger Zone!).
   *
   * @returns void
   */
  async deleteAllMemos(): Promise<void> {
    const db = await openShifterzDB()
    try {
      await db.executeSql('DELETE FROM memos;')

      console.log('All memos deleted.')
    } catch (error) {
      console.error('Error deleting all memos:', error)

      throw error
    }
  }
}
