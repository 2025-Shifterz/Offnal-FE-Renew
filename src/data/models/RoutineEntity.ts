import { MealEntity } from './MealEntity'
import { HealthEntity } from './HealthEntity'

export interface RoutineEntity {
  meals: MealEntity[]
  health: HealthEntity
}
