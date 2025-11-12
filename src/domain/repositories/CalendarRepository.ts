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
    organizationId: number,
    startDate: string,
    endDate: string,
    shiftsData: UpdateShiftsRequest
  ): Promise<void>

  deleteCalendar(
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<void>
}
