import { Calendar } from '../models/Calendar'

export interface CalendarRepository {
  createCalendar(): Promise<void>

  getCalendar(
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<Calendar[]>

  updateWorkCalendar(
    year: number,
    month: number,
    shifts: string[]
  ): Promise<void>

  deleteCalendar(year: number, month: number): Promise<void>
}
