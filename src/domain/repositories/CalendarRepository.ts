import { CreateCalendarRequest } from '../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../../infrastructure/remote/request/PatchWorkCalendarReqeust'
import { GetWorkCalendarResponseData } from '../../infrastructure/remote/response/GetWorkCalendarResponse'

export interface CalendarRepository {
  createCalendar(calendarData: CreateCalendarRequest): Promise<void>

  getCalendar(
    organizationName: string,
    team: string,
    startDate: string,
    duration: string
  ): Promise<GetWorkCalendarResponseData[]>

  updateCalendar(
    organizationName: string,
    team: string,
    shiftsData: UpdateShiftsRequest
  ): Promise<void>

  deleteCalendar(organizationName: string, team: string): Promise<void>
}
