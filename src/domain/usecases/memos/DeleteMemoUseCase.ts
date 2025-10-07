import { MemoRepository } from '../../repositories/MemoRepository'

export class DeleteMemoUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(id: number): Promise<void> {
    await this.memoRepository.deleteMemo(id)
  }
}
