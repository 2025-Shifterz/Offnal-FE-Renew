export interface GetTodosResponse {
  code: string
  message: string
  result: GetTodosResponseResult[]
}

export interface GetTodosResponseResult {
  id: number
  content: string
  completed: boolean
  targetDate: string
  organizationId: number
}
