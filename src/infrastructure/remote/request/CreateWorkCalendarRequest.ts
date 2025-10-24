import { WorkTypeEn } from '../../../shared/types/Calendar'

export interface WorkTimeDetail {
  startTime: string
  endTime: string
}

export interface MonthlyShift {
  startDate: string
  endDate: string
  shifts: {
    [date: string]: string
  }
}

export interface CreateCalendarRequest {
  calendarName: string
  organizationId: number
  workTimes: { [K in WorkTypeEn]: WorkTimeDetail }
  calendars: MonthlyShift[]
}
