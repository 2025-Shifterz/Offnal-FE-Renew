import { WorkType } from './Calendar'

export interface WorkTypeInfo {
  workTypeName: WorkType
  startTime: string
  endTime: string
}

export interface TeamCalendarRecord {
  team: string
  workInstances: Record<string, WorkTypeInfo>
}

// teamCalendarData 형식으로 저장하기 위한 원시 데이터 형태
export interface TeamDateAndWorkType {
  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
  startTime: string
  endTime: string
}
