export interface GetRoutineResponse {
  code: string
  message: string
  data: {
    meals: MealResponse[]
    health: HealthResponse
  }
}

export interface MealResponse {
  label: string
  time: string
  description: string
  items: string[]
}

export interface HealthResponse {
  fastingComment: string
  fastingSchedule: string
  sleepGuide: string[]
  sleepSchedule: string
}
