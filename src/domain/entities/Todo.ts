export type TodoType = "todo" | "memo";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: TodoType;
  createdAt?: string;
}
