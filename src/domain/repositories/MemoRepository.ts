import { Todo } from "../entities/Todo";
import dayjs from "dayjs";

export interface MemoRepository {
  getAllMemos(): Promise<Todo[]>;

  getMemosByDate(targetDate: dayjs.Dayjs): Promise<Todo[]>;

  addMemo(memo: Omit<Todo, "id">, targetDate?: dayjs.Dayjs): Promise<Todo>;

  updateMemoComplete(id: number, completed: boolean): Promise<boolean>;

  deleteMemo(id: number): Promise<boolean>;

  deleteMemoAll(): Promise<void>;
}
