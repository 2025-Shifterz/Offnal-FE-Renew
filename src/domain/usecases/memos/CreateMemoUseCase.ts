import dayjs from 'dayjs'
import { MemoRepository } from '../../repositories/MemoRepository'

export class CreateMemoUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(content: string, targetDate: dayjs.Dayjs): Promise<void> {
    return await this.memoRepository.addMemo({ content }, targetDate)
  }
}
