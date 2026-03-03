export interface PostCreateTodoRequest {
  content: string
  completed: boolean
  targetDate: string
  organizationId: number
}
