import {
  Health,
  HomeResponse,
  Meal,
} from '../../infrastructure/remote/response/homeResponse'
import { HealthEntity } from '../models/HealthEntity'
import { HomeEntity } from '../models/HomeEntity'
import { MealEntity } from '../models/MealEntity'
import { RoutineEntity } from '../models/RoutineEntity'

export const toMealDataModel = (response: Meal): MealEntity => ({
  label: response.label,
  time: response.time,
  description: response.description,
  items: response.items,
})

export const toHealthDataModel = (response: Health): HealthEntity => ({
  fastingComment: response.fastingComment,
  fastingSchedule: response.fastingSchedule,
  sleepGuide: response.sleepGuide,
  sleepSchedule: response.sleepSchedule,
})

export const toRoutineDataModel = (
  mealResponse: Meal[],
  healthResponse: Health
): RoutineEntity => ({
  meals: mealResponse.map(toMealDataModel),
  health: toHealthDataModel(healthResponse),
})

export const toHomeDataModel = (
  response: HomeResponse['data']
): HomeEntity => ({
  yesterdayType: response.yesterdayType,
  todayType: response.todayType,
  tomorrowType: response.tomorrowType,
  todayRoutine: toRoutineDataModel(
    response.todayRoutine.meals,
    response.todayRoutine.health
  ),
})
