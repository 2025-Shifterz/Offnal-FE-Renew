import dayjs from 'dayjs'
import { Memo } from '../../infrastructure/local/entities/MemoEntity'

export interface MemoRepository {
  getAllMemos(): Promise<Memo[]>

  getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]>

  addMemo(memo: Omit<Memo, 'id'>, targetDate: dayjs.Dayjs): Promise<void>

  updateMemo(
    id: number,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void>

  deleteMemo(id: number): Promise<void>

  deleteMemoAll(): Promise<void>
}
