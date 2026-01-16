import dayjs from 'dayjs'
import { MemoRepository } from '../../repositories/MemoRepository'

export class UpdateMemoUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(
    id: number,
    title: string,
    content: string,
    targetDate: dayjs.Dayjs
  ): Promise<void> {
    return await this.memoRepository.updateMemo(id, title, content, targetDate)
  }
}
