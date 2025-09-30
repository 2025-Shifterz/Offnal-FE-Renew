export interface WorkTimeDetail {
  startTime: string
  endTime: string
}

export interface MonthlyShift {
  year: string
  month: string
  shifts: {
    [day: string]: string
  }
}

export interface CreateCalendarRequest {
  calendarName: string
  workGroup: string
  workTimes: { [workType: string]: WorkTimeDetail }
  calendars: MonthlyShift[]
}
