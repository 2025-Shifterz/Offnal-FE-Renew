import { WorkType } from './Calendar'

export interface TeamCalendarRecord {
  team: string
  workInstances: Record<string, TeamDateAndWorkType>
}

export interface TeamDateAndWorkType {
  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
  startTime?: string
  endTime?: string
}
