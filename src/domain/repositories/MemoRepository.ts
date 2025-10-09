import dayjs from 'dayjs'
import { Memo } from '../models/Memo'

export interface MemoRepository {
  getAllMemos(): Promise<Memo[]>

  getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]>

  addMemo(content: string, targetDate: dayjs.Dayjs): Promise<void>

  updateMemo(
    id: number,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void>

  deleteMemo(id: number): Promise<void>

  deleteMemoAll(): Promise<void>
}
