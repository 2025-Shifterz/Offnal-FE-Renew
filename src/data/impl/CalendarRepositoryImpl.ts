import EncryptedStorage from 'react-native-encrypted-storage'
import { Calendar } from '../../domain/models/Calendar'
import { CalendarRepository } from '../../domain/repositories/CalendarRepository'
import { CalendarService } from '../../infrastructure/remote/api/CalendarService'
import { CreateCalendarRequest } from '../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../../infrastructure/remote/request/PatchWorkCalendarReqeust'
import { CalendarEntity } from '../models/CalendarEntity'
import { toCalendarDomain } from '../mappers/CalendarMapper'
import { convertDurationToEndTime } from '../../shared/utils/calendar/convertDuration'

// DTO → Entity → Domain 모델로 두 번 변환
// infrastructure는 “서버에서 온 날것의 데이터”, - DTO
// data는 “앱 내부 데이터의 표준 포맷”, - Entity
// domain은 “비즈니스 의미만 표현하는 순수 모델” - Domain 모델

// Entity는 저장하기 좋은 형태
// Domain은 애플리케이션이 “의미 있게 다루기 좋은 형태”

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
    // 도메인 모델 반환
    try {
      const response = await this.calendarService.getWorkCalendar(
        organizationName,
        team,
        startDate,
        endDate
      )

      // DTO -> Entity 변환
      const entities: CalendarEntity[] = response.map(item => ({
        date: item.date,
        workTypeName: item.workTypeName,
        startTime: item.startTime,
        endTime: convertDurationToEndTime(item.startTime, item.duration),
      }))

      // Entity -> Domain
      const domainModels: Calendar[] = toCalendarDomain(entities)
      return domainModels
    } catch (error) {
      throw error
    }
  }

  async updateCalendar(
    organizationName: string,
    team: string,
    shiftsData: UpdateShiftsRequest
  ): Promise<void> {
    try {
      const res = await this.calendarService.updateWorkCalendar(
        organizationName,
        team,
        shiftsData
      )
      return res
    } catch (error) {
      throw error
    }
  }

  async deleteCalendar(organizationName: string, team: string): Promise<void> {
    try {
      const res = await this.calendarService.deleteWorkCalendar(
        organizationName,
        team
      )
      return res
    } catch (error) {
      throw error
    }
  }
}
