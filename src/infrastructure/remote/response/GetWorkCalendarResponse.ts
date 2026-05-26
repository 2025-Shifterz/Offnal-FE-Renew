import { ShiftType } from '../../../shared/types/Calendar'

export interface GetWorkCalendarResponse {
  code: string
  message: string
  data: GetWorkCalendarResponseData[]
}

export interface GetWorkCalendarResponseData {
  date: string
  workTypeName: ShiftType
  startTime: string
  duration: string
}
