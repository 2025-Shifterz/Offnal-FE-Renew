import { RoutineIllustrationName } from './RoutineIllustration'

export type RoutineIllustrationCategory =
  | 'sleep'
  | 'meal'
  | 'rest'
  | 'snack'
  | 'working'
  | 'hydration'
  | 'exercise'
  | 'readyForWork'

export const routineIllustrationByCategory = {
  sleep: 'bed',
  meal: 'food',
  rest: 'rest',
  snack: 'snack',
  working: 'working',
  hydration: 'water',
  exercise: 'fire',
  readyForWork: 'readyforwork',
} as const satisfies Record<
  RoutineIllustrationCategory,
  RoutineIllustrationName
>

export const getRoutineIllustration = (
  category: RoutineIllustrationCategory
): RoutineIllustrationName => routineIllustrationByCategory[category]
