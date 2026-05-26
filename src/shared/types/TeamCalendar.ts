import { ShiftType, ShiftTypeInfo } from './Calendar'

export interface TeamCalendarRecord {
  team: string
  shiftInstances: Record<string, ShiftTypeInfo>
}

// teamCalendarData 형식으로 저장하기 위한 원시 데이터 형태
export interface TeamDateAndShiftType {
  date: string // "YYYY-MM-DD"
  shiftTypeName: ShiftType
  startTime: string
  endTime: string
}
