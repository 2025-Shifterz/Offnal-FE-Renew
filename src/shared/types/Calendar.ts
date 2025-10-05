export type WorkType = '주간' | '야간' | '오후' | '휴일'

export interface WorkTypeInfo {
  workTypeName: WorkType
}

// "YYYY-MM-DD" → WorkTypeInfo 형태의 매핑
export type CalendarData = Record<string, WorkTypeInfo>

export interface DateAndWorkType {
  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
}
