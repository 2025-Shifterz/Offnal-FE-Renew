export interface GetMemosResponse {
  code: string
  message: string
  result: GetMemosResponseResult[]
}

export interface GetMemosResponseResult {
  id: number
  content: string
  targetDate: string
  organizationId: number
}
