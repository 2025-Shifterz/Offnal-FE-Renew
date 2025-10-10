import dayjs from 'dayjs'
import { MemoRepository } from '../../domain/repositories/MemoRepository'
import { MemoDao } from '../../infrastructure/local/dao/MemoDao'
import { toMemoDomainArray } from '../mappers/MemoMapper'
import { Memo } from '../../domain/models/Memo'

export class MemoRepositoryImpl implements MemoRepository {
  constructor(private memoDao: MemoDao) {}

  async getAllMemos(): Promise<Memo[]> {
    const memos = await this.memoDao.getAllMemos()
    const result = toMemoDomainArray(memos)

    return result
  }

  async getMemosByDate(targetDate: dayjs.Dayjs): Promise<Memo[]> {
    const memos = await this.memoDao.getMemosByDate(targetDate)
    const result = toMemoDomainArray(memos)

    return result
  }

  async addMemo(content: string, targetDate: dayjs.Dayjs): Promise<void> {
    return this.memoDao.createMemo(content, targetDate)
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
