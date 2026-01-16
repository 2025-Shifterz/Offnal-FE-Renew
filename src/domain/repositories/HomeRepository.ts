import { Routine } from '../models/Routine'
import { Schedule } from '../models/Schedule'

export interface HomeRepository {
  getSchedule(): Promise<Schedule>

  getRoutine(): Promise<Routine>

  getRoutineByDate(date: string): Promise<Routine>
}
