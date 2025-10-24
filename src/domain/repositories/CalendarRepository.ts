import { CreateCalendarRequest } from '../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../../infrastructure/remote/request/PatchWorkCalendarReqeust'
import { GetWorkCalendarResponseData } from '../../infrastructure/remote/response/GetWorkCalendarResponse'

export interface CalendarRepository {
  createCalendar(
    organizationId: number,
    calendarData: CreateCalendarRequest
  ): Promise<void>

  getCalendar(
    organizationId: number,
    startDate: string,
    endDate: string
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
