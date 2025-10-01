import dayjs from 'dayjs'
import { MemoRepository } from '../../domain/repositories/MemoRepository'
import { MemoDao } from '../../infrastructure/local/dao/MemoDao'
import { Memo } from '../../infrastructure/local/entities/MemoEntity'

export class MemoRepositoryImpl implements MemoRepository {
  constructor(private memoDao: MemoDao) {}

  async getAllMemos(): Promise<Memo[]> {
    return this.memoDao.getAllMemos()
  }

  async getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]> {
    return this.memoDao.getMemosByDate(targetDate)
  }

  async addMemo(
    memo: Omit<Memo, 'id'>,
    targetDate: dayjs.Dayjs
  ): Promise<void> {
    return this.memoDao.createMemo(memo.content, targetDate)
  }

  async updateMemo(
    id: number,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void> {
    return this.memoDao.updateMemo(id, content, targetDate)
  }

  async deleteMemo(id: number): Promise<void> {
    return this.memoDao.deleteMemo(id)
  }

  async deleteMemoAll(): Promise<void> {
    return this.memoDao.deleteAllMemos()
  }
}
