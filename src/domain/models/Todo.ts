export interface Todo {
  id: number
  content: string
  isCompleted: boolean
  targetDate: number // Unix timestamp (milliseconds)
}
