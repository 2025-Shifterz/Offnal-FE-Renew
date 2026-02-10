export interface GetScheduleInfoResponse {
  code: string
  message: string
  data: GetScheduleInfoResponseData[]
}

// 서버 응답은 null 가능 -> 프론트엔드에서는 string으로 통일
export interface GetScheduleInfoResponseData {
  calendarId: number
  workTimes: {
    D: { startTime: string | null; duration: string | null }
    E: { startTime: string | null; duration: string | null }
    N: { startTime: string | null; duration: string | null }
  }
}

export interface WorkTimeDuration {
  startTime: string
  duration: string
}
