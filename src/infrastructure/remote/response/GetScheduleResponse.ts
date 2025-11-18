export interface GetScheduleResponse {
  code: string
  message: string
  data: {
    yesterdayType: string
    todayType: string
    tomorrowType: string
  }
}
