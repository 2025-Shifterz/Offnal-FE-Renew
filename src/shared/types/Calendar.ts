export type WorkType = '주간' | '야간' | '오후' | '휴일' | string
export type WorkTypeEn = 'D' | 'E' | 'N' | '-'

export interface WorkTypeInfo {
  workTypeName: WorkType
  startTime?: string
  endTime?: string
}

// "YYYY-MM-DD" → WorkTypeInfo 형태의 매핑
// 프론트엔드에서 캘린더 데이터를 다룰 때 사용
export type DateAndWorkTypeRecord = Record<string, WorkTypeInfo>

// calendarData 형식으로 저장하기 위한 원시 데이터 형태
export interface DateAndWorkType {
  date: string // "YYYY-MM-DD"
  workTypeName: WorkType
  startTime: string
  endTime: string
}
