import dayjs from 'dayjs'
import { MemoRepository } from '../../repositories/MemoRepository'
import { Memo } from '../../models/Memo'

export class GetMemosByDateUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Memo[]> {
    return await this.memoRepository.getMemosByDate(targetDate)
  }
}
