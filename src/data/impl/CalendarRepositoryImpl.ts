import EncryptedStorage from 'react-native-encrypted-storage'
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

  // 캘린더 GET 요청을 위해 로컬에 저장
  async initUserCalendarData(
    organizationName: string,
    team: string
    //startDate: string,
    //endDate: string
  ): Promise<void> {
    try {
      await EncryptedStorage.setItem('organizationName', organizationName)
      await EncryptedStorage.setItem('team', team)
    } catch (error) {
      console.error('CalendarRepository Error - initUserCalendarData()', error)

      return
    }
  }

  // 저장된 조직 이름 가져오기
  async getOrganizationName(): Promise<string> {
    try {
      const storedOrganization =
        await EncryptedStorage.getItem('organizationName')
      return storedOrganization ?? '' // 값이 없으면 빈 문자열 반환
    } catch (error) {
      console.error('CalendarRepository Error - getOrganizationName():', error)
      return ''
    }
  }

  // 저장된 팀 가져오기
  async getTeam(): Promise<string> {
    try {
      const storedTeam = await EncryptedStorage.getItem('team')
      return storedTeam ?? ''
    } catch (error) {
      console.error('CalendarRepository Error - getTeam():', error)
      return ''
    }
  }
}
