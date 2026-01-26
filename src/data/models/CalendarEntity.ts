export interface CalendarEntity {
  date: string
  workTypeName: '주간' | '오후' | '야간' | '휴일' | string
  startTime: string | null
  endTime: string | null // endTime = startTime + duration
}
