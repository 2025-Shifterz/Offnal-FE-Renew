import { WorkCalendarRepository } from '../../domain/repositories/CalendarRepository'
import { CalendarService } from '../../infrastructure/remote/api/CalendarService'
import {
  toCreateCalendarRequest,
  toUpdateShiftsRequest,
  toWorkDayModels,
} from '../mapper/Mapper'
import { WorkDay, NewCalendar, ShiftsMap } from '../model/Calendar'

export class WorkCalendarRepositoryImpl implements WorkCalendarRepository {
  constructor(private calendarService: CalendarService) {}

  async getWorkCalendar(year: number, month: number): Promise<WorkDay[]> {
    try {
      const response = await this.calendarService.getWorkCalendar(year, month)
      const model = toWorkDayModels(response)

      return model
    } catch (error) {
      console.error('Error fetching work calendar:', error)
      throw error
    }
  }
  async createWorkCalendar(calendarData: NewCalendar): Promise<void> {
    try {
      const request = toCreateCalendarRequest(calendarData)

      await this.calendarService.createWorkCalendar(request)
    } catch (error) {
      console.error('Error creating work calendar:', error)
      throw error
    }
  }

  async deleteWorkCalendar(year: number, month: number): Promise<void> {
    try {
      await this.calendarService.deleteWorkCalendar(year, month)
    } catch (error) {
      console.error('Error deleting work calendar:', error)
      throw error
    }
  }
  async updateWorkCalendar(
    year: number,
    month: number,
    calendarData: ShiftsMap
  ): Promise<any> {
    try {
      const requestDto = toUpdateShiftsRequest(calendarData)
      console.log('Updating work calendar with request:', requestDto)

      return await this.calendarService.updateWorkCalendar(
        year,
        month,
        requestDto
      )
    } catch (error) {
      console.error('Error updating work calendar:', error)
      throw error
    }
  }
}
