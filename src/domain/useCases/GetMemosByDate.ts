import { Todo } from "../entities/Todo";
import dayjs from "dayjs";
import { MemoRepository } from "../repositories/MemoRepository";

export class GetMemosByDateUseCase {
  constructor(private memoRepository: MemoRepository) {}

  async execute(targetDate: dayjs.Dayjs): Promise<Todo[]> {
    return await this.memoRepository.getMemosByDate(targetDate);
  }
}
