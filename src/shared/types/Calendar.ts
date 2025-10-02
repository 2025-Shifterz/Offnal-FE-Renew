export type WorkType = '주간' | '야간' | '오후' | '휴일'

export interface DateAndWorkType {
  date: string // 'YYYY-MM-DD'
  workTypeName: WorkType
}

// 날짜별로 매핑
export type CalendarDataState = Map<string, DateAndWorkType>
