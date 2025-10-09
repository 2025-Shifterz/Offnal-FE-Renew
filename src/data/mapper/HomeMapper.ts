import {
  Meal as ApiMeal,
  Health as ApiHealth,
  TodayRoutine,
} from '../../remote/response/homeResponse'

// 컴포넌트가 기대하는 타입들 - 백엔드 응답과 동일
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

export interface Alarm {
  [key: string]: unknown
}

/**
 * API 응답의 Meal을 컴포넌트가 기대하는 Meal 타입으로 변환
 * 구조가 동일하므로 그대로 반환
 */
export function toMealModel(apiMeal: ApiMeal): Meal {
  return apiMeal
}

/**
 * API 응답의 Health를 컴포넌트가 기대하는 Health 타입으로 변환
 * 구조가 동일하므로 그대로 반환
 */
export function toHealthModel(apiHealth: ApiHealth): Health {
  return apiHealth
}

/**
 * API 응답의 TodayRoutine을 컴포넌트가 기대하는 타입으로 변환
 */
export function toTodayRoutineModel(todayRoutine: TodayRoutine) {
  return {
    meals: todayRoutine.meals.map(toMealModel),
    health: toHealthModel(todayRoutine.health),
  }
}
