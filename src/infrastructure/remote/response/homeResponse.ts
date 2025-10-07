export interface Meal {
  label: string
  time: string
  description: string
  items: string[]
}

export interface Health {
  fastingComment: string
  fastingSchedule: string
  sleepGuide: string[]
  sleepSchedule: string
}

export interface TodayRoutine {
  meals: Meal[]
  health: Health
}

export interface HomeResponse {
  success: boolean
  data: {
    yesterdayType: string
    todayType: string
    tomorrowType: string
    todayRoutine: TodayRoutine
  }
}
