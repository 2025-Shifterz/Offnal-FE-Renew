import dayjs from 'dayjs'
import { Memo } from '../models/Memo'

export interface MemoRepository {
  getAllMemos(): Promise<Memo[]>

  getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]>

  getMemoById(id: number): Promise<Memo | undefined>

  addMemo(
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<Memo>

  updateMemo(
    id: number,
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void>

  deleteMemo(id: number): Promise<void>

  deleteMemoAll(): Promise<void>
}
