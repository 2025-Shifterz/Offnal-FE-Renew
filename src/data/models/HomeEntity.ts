import { RoutineEntity } from './RoutineEntity'

export interface HomeEntity {
  yesterdayType: string
  todayType: string
  tomorrowType: string
  todayRoutine: RoutineEntity
}
