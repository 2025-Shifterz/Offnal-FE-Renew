export type WorkType = '주간' | '오후' | '야간' | '휴일' | string

export interface Calendar {
  date: string
  workTypeName: WorkType
  startTime: string
  endTime: string // endTime = startTime + duration
}
