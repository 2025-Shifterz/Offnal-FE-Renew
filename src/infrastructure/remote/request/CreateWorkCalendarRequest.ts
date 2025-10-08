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
  workTimes: { [workType: string]: WorkTimeDetail }
  calendars: MonthlyShift[]
}
