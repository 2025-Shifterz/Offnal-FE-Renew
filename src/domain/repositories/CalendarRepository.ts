import { CreateCalendarRequest } from '../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../../infrastructure/remote/request/PatchWorkCalendarReqeust'
import { Calendar } from '../models/Calendar'

export interface CalendarRepository {
  createCalendar(calendarData: CreateCalendarRequest): Promise<void>

  getCalendar(
    organizationName: string,
    team: string,
    startDate: string,
    duration: string
  ): Promise<Calendar[]>

  updateCalendar(
    organizationName: string,
    team: string,
    shiftsData: UpdateShiftsRequest
  ): Promise<void>

  deleteCalendar(organizationName: string, team: string): Promise<void>
}
