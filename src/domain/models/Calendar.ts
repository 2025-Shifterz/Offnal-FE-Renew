export interface Calendar {
  date: string
  workTypeName: '주간' | '오후' | '야간' | '휴일' | string
  startTime: string
  duration: string
}
