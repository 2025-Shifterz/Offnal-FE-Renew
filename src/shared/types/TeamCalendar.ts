import { DateAndWorkTypeRecord, WorkType } from './Calendar'

export interface TeamCalendarRecord {
  team: string
  dates: DateAndWorkTypeRecord
}

export interface TeamDateAndWorkType {
  team: string

  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
  startTime: string
  endTime: string
}
