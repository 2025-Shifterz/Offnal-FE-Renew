export interface CalendarEntity {
  date: string
  shiftTypeName: '주간' | '오후' | '야간' | '휴일' | '근무 없음'
  startTime: string | null
  endTime: string | null // endTime = startTime + duration
}
