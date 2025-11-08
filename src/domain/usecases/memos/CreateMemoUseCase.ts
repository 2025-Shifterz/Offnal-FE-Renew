import dayjs from 'dayjs'
import { MemoRepository } from '../../repositories/MemoRepository'
import { Memo } from '../../models/Memo'

export class CreateMemoUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<Memo> {
    return await this.memoRepository.addMemo(title, content, targetDate)
  }
}
