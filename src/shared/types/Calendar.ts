export type WorkType = '주간' | '야간' | '오후' | '휴일' | string
export type WorkTypeEn = 'D' | 'E' | 'N' | '-' | string

export interface WorkTypeInfo {
  workTypeName: WorkType
  startTime?: string
  duration?: string
}

// "YYYY-MM-DD" → WorkTypeInfo 형태의 매핑
export type DateAndWorkTypeRecord = Record<string, WorkTypeInfo>

export interface DateAndWorkType {
  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
  startTime: string
  duration: string
}
