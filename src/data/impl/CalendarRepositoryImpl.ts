import { Calendar } from '../../domain/models/Calendar'
import { CalendarRepository } from '../../domain/repositories/CalendarRepository'
import { CalendarService } from '../../infrastructure/remote/api/CalendarService'
import { toCalendarDomain } from '../mappers/CalendarMapper'

export class CalendarRepositoryImpl implements CalendarRepository {
  constructor(private calendarService: CalendarService) {}

  async createCalendar(): Promise<void> {
    // TODO("Method not implemented.")
  }

  async getCalendar(
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<Calendar[]> {
    try {
      const response = await this.calendarService.getWorkCalendar(
        organizationId,
        startDate,
        endDate
      )
      const result = toCalendarDomain(response)

      return result
    } catch (error) {
      throw error
    }
  }

  async updateWorkCalendar(
    year: number,
    month: number,
    shifts: string[]
  ): Promise<void> {
    // TODO("Method not implemented.")
  }

  async deleteCalendar(year: number, month: number): Promise<void> {
    try {
      return await this.calendarService.deleteWorkCalendar(year, month)
    } catch (error) {
      throw error
    }
  }
}
