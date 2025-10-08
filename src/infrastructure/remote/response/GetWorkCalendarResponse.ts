import { WorkType } from '../../../shared/types/Calendar'

export interface GetWorkCalendarResponse {
  code: string
  message: string
  data: GetWorkCalendarResponseData[]
}

export interface GetWorkCalendarResponseData {
  date: string
  workTypeName: WorkType
}
