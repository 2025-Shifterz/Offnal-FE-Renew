import { CalendarRepository } from '../../domain/repositories/CalendarRepository'
import { CalendarService } from '../../infrastructure/remote/api/CalendarService'
import { toCalendarDataModel } from '../mappers/CalendarMapper'
import { CalendarEntity } from '../models/CalendarEntity'

export class CalendarRepositoryImpl implements CalendarRepository {
  constructor(private calendarService: CalendarService) {}

  async createCalendar(): Promise<void> {
    // TODO("Method not implemented.")
  }

  async getCalendar(year: number, month: number): Promise<CalendarEntity[]> {
    try {
      const response = await this.calendarService.getWorkCalendar(year, month)
      const result = toCalendarDataModel(response)

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
