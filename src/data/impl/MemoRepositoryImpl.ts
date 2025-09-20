import { Dayjs } from "dayjs";
import { Todo } from "../../domain/entities/Todo";
import { MemoRepository } from "../../domain/repositories/MemoRepository";
import { MemoDao } from "../../infrastructure/local/dao/MemoDao";

export class MemoRepositoryImpl implements MemoRepository {
  constructor(private memoDao: MemoDao) {}

  async getAllMemos(): Promise<Todo[]> {
    return await this.memoDao.getAllMemos();
  }

  async getMemosByDate(targetDate: Dayjs): Promise<Todo[]> {
    return await this.memoDao.getMemosByDate(targetDate);
  }

  async addMemo(memo: Omit<Todo, "id">, targetDate?: Dayjs): Promise<Todo> {
    return await this.memoDao.createMemo(memo.text, targetDate);
  }

  async updateMemoComplete(id: number, completed: boolean): Promise<boolean> {
    return await this.memoDao.updateMemo(id, { completed: completed });
  }

  async deleteMemo(id: number): Promise<boolean> {
    return await this.memoDao.deleteMemo(id);
  }

  async deleteMemoAll(): Promise<void> {
    return await this.memoDao.deleteAllMemos();
  }
}
