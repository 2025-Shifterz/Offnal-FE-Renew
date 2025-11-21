import { Health } from '../../domain/models/Health'
import { Meal } from '../../domain/models/Meal'
import { Routine } from '../../domain/models/Routine'
import { Schedule } from '../../domain/models/Schedule'
import {
  HealthResponse,
  MealResponse,
} from '../../infrastructure/remote/response/GetRoutineResponse'
import { GetScheduleResponse } from '../../infrastructure/remote/response/GetScheduleResponse'

export const toMealDomain = (response: MealResponse): Meal => ({
  label: response.label,
  time: response.time,
  description: response.description,
  items: response.items,
})

export const toHealthDomain = (response: HealthResponse): Health => ({
  fastingComment: response.fastingComment,
  fastingSchedule: response.fastingSchedule,
  sleepGuide: response.sleepGuide,
  sleepSchedule: response.sleepSchedule,
})

export const toRoutineDomain = (
  mealResponse: MealResponse[],
  healthResponse: HealthResponse
): Routine => ({
  meals: mealResponse.map(toMealDomain),
  health: toHealthDomain(healthResponse),
})

export const toScheduleDomain = (response: GetScheduleResponse): Schedule => ({
  yesterdayType: response.data.yesterdayType,
  todayType: response.data.todayType,
  tomorrowType: response.data.tomorrowType,
})
