import dayjs from 'dayjs'
import { MemoRepository } from '../../domain/repositories/MemoRepository'
import { MemoDao } from '../../infrastructure/local/dao/MemoDao'
import { toMemoDomain, toMemoDomainArray } from '../mappers/MemoMapper'
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

  async getMemoById(id: number): Promise<Memo | undefined> {
    const memo = await this.memoDao.getMemoById(id)
    if (!memo) {
      return undefined
    }
    const result = toMemoDomain(memo)

    return result
  }

  async addMemo(
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<Memo> {
    const memo = await this.memoDao.createMemo(title, content, targetDate)
    const result = toMemoDomain(memo)

    return result
  }

  async updateMemo(
    id: number,
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void> {
    return this.memoDao.updateMemo(id, title, content, targetDate)
  }

  async deleteMemo(id: number): Promise<void> {
    return this.memoDao.deleteMemo(id)
  }

  async deleteMemoAll(): Promise<void> {
    return this.memoDao.deleteAllMemos()
  }
}
