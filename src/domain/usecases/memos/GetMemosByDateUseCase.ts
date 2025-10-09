import dayjs from 'dayjs'
import { MemoRepository } from '../../repositories/MemoRepository'
import { toMemoDomain } from '../../mappers/MemoMapper'
import { Memo } from '../../models/Memo'

export class GetMemosByDateUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Memo[]> {
    const memos = await this.memoRepository.getMemosByDate(targetDate)
    const result = memos.map(toMemoDomain)

    return result
  }
}
