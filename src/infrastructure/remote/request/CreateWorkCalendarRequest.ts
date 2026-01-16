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

export interface CreateCalendarRequest {
  myTeam: string
  workTimes: { [K in WorkTypeEn]: WorkTimeDetail }
  calendars: MonthlyShift[]
}
