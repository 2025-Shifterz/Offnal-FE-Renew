import { WorkType } from '../../../domain/models/Calendar'

export type AlarmSnoozeIntervalMinutes = 1 | 3 | 5 | 10 | 15
export type AlarmSnoozeRepeatCount = 1 | 3 | 5 | 10 | 'infinite'
export type AlarmWeekdayLabel = '일' | '월' | '화' | '수' | '목' | '금' | '토'

export interface AlarmSnoozeSetting {
  enabled: boolean
  intervalMinutes: AlarmSnoozeIntervalMinutes
  repeatCount: AlarmSnoozeRepeatCount
}

/**
 * 알람 생성/수정 화면에서 사용하는 UI 전용 draft 모델입니다.
 *
 * 저장용 entity나 도메인 모델이 아니라, 사용자가 입력 중인 상태를 표현합니다.
 */
export interface AlarmDraft {
  id?: number
  alarmTime: Date
  selectedWorkType: WorkType
  selectedDays: AlarmWeekdayLabel[]
  isHolidayAlarmOff: boolean
  snoozeSetting: AlarmSnoozeSetting
  isEnabled: boolean
}

export type CreateAutoAlarmDraft = Omit<AlarmDraft, 'id'>
export type UpdateAutoAlarmDraft = AlarmDraft & { id: number }
