import { MemoRepository } from '../../repositories/MemoRepository'
import { Memo } from '../../models/Memo'

export class GetMemoByIdUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(id: number): Promise<Memo | undefined> {
    return await this.memoRepository.getMemoById(id)
  }
}
