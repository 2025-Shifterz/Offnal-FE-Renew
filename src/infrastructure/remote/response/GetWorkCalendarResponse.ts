export interface GetWorkCalendarResponse {
  code: string
  message: string
  data: GetWorkCalendarResponseData[]
}

export interface GetWorkCalendarResponseData {
  day: string
  workTypeName: '주간' | '오후' | '야간' | '휴일' | string
}
