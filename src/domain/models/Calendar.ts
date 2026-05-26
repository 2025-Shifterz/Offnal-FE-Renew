export type ShiftType = '주간' | '오후' | '야간' | '휴일' | '근무 없음'

export interface Calendar {
  date: string
  shiftTypeName: ShiftType
  startTime: string
  endTime: string // endTime = startTime + duration
}
