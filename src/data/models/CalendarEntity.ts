export interface CalendarEntity {
  date: string
  workTypeName: '주간' | '오후' | '야간' | '휴일' | string
  startTime: string
  endTime: string // endTime = startTime + duration
}
