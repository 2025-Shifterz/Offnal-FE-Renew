import { WorkTypeEn } from '../../../shared/types/Calendar'

export interface InputWorkTimeDetail {
  startTime: string
  endTime: string
}

export interface WorkTimeDetail {
  startTime: string
  duration: string // PT8H30M 형식
}

export interface MonthlyShift {
  organizationName: string
  team: string
  shifts: {
    [date: string]: string
  }
}

type WorkTimeKey = ['D', 'E', 'N'] // DTO의 키 값
export interface CreateCalendarRequest {
  myTeam: string
  workTimes: { [K in WorkTimeKey[number]]: WorkTimeDetail }
  calendars: MonthlyShift[]
}
