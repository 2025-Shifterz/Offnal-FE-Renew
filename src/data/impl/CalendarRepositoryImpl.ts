import { Calendar } from '../../domain/models/Calendar'
import { CalendarRepository } from '../../domain/repositories/CalendarRepository'
import { CalendarService } from '../../infrastructure/remote/api/CalendarService'
import { CreateCalendarRequest } from '../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../../infrastructure/remote/request/PatchWorkCalendarReqeust'

export class CalendarRepositoryImpl implements CalendarRepository {
  constructor(private calendarService: CalendarService) {}

  async createCalendar(calendarData: CreateCalendarRequest): Promise<void> {
    try {
      const res = await this.calendarService.createWorkCalendar(calendarData)

      return res
    } catch (error) {
      throw error
    }
  }

  async getCalendar(
    organizationName: string,
    team: string,
    startDate: string,
    endDate: string
  ): Promise<Calendar[]> {
    try {
      const res = await this.calendarService.getWorkCalendar(
        organizationName,
        team,
        startDate,
        endDate
      )
      return res
    } catch (error) {
      throw error
    }
  }

  async updateCalendar(
    organizationId: number,
    startDate: string,
    endDate: string,
    shiftsData: UpdateShiftsRequest
  ): Promise<void> {
    try {
      const res = await this.calendarService.updateWorkCalendar(
        organizationId,
        startDate,
        endDate,
        shiftsData
      )
      return res
    } catch (error) {
      throw error
    }
  }

  async deleteCalendar(
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<void> {
    try {
      const res = await this.calendarService.deleteWorkCalendar(
        organizationId,
        startDate,
        endDate
      )
      return res
    } catch (error) {
      throw error
    }
  }
}
