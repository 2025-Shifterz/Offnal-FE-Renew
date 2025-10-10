import {
  Health,
  HomeResponse,
  Meal,
} from '../../infrastructure/remote/response/homeResponse'
import { Health as HealthDomain } from '../../domain/models/Health'
import { Home as HomeDomain } from '../../domain/models/Home'
import { Meal as MealDomain } from '../../domain/models/Meal'
import { Routine as RoutineDomain } from '../../domain/models/Routine'

export const toMealDomain = (response: Meal): MealDomain => ({
  label: response.label,
  time: response.time,
  description: response.description,
  items: response.items,
})

export const toHealthDomain = (response: Health): HealthDomain => ({
  fastingComment: response.fastingComment,
  fastingSchedule: response.fastingSchedule,
  sleepGuide: response.sleepGuide,
  sleepSchedule: response.sleepSchedule,
})

export const toRoutineDomain = (
  mealResponse: Meal[],
  healthResponse: Health
): RoutineDomain => ({
  meals: mealResponse.map(toMealDomain),
  health: toHealthDomain(healthResponse),
})

export const toHomeDomain = (response: HomeResponse['data']): HomeDomain => ({
  yesterdayType: response.yesterdayType,
  todayType: response.todayType,
  tomorrowType: response.tomorrowType,
  todayRoutine: toRoutineDomain(
    response.todayRoutine.meals,
    response.todayRoutine.health
  ),
})
