import dayjs from 'dayjs'
import { MemoEntity } from '../../data/models/MemoEntity'

export interface MemoRepository {
  getAllMemos(): Promise<MemoEntity[]>

  getMemosByDate(targetDate: dayjs.Dayjs): Promise<MemoEntity[]>

  addMemo(content: string, targetDate: dayjs.Dayjs): Promise<void>

  updateMemo(
    id: number,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void>

  deleteMemo(id: number): Promise<void>

  deleteMemoAll(): Promise<void>
}
