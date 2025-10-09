/** 근무 형태를 나타내는 Enum (Type-Safe) */
// export enum ShiftType {
//   DAY = '주간',
//   EVENING = '오후',
//   NIGHT = '야간',
//   OFF = '휴일',
//   UNKNOWN = '기타',
// }
export type ShiftType = '주간' | '야간' | '오후' | '휴일'

/** 앱의 Domain 또는 UI Layer에서 사용할 근무일 모델 */
export interface WorkDay {
  day: number
  shift: ShiftType
}

/** 월별 근무 Domain 모델 */
export interface MonthlySchedule {
  year: number
  month: number
  shifts: ShiftsMap // 위에서 정의한 ShiftsMap 재사용
}

/** 새 캘린더 생성을 위한 Domain 모델 */
export interface NewCalendar {
  name: string
  group: string
  shiftTimes: Map<ShiftType, { startTime: string; endTime: string }>
  schedules: MonthlySchedule[]
}

/** 근무 수정을 위한 Domain 모델. Key: 날짜(string, 'YYYY-MM-DD'), Value: 근무형태(ShiftType) */
export type ShiftsMap = Map<string, ShiftType>
