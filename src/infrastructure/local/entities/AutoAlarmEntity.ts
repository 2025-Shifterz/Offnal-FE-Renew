import { WorkType } from '../../../domain/models/Calendar'

/**
 * ## AutoAlarmEntity
 *
 * 자동알람의 엔티티 입니다.
 *
 * @note weekdays는 앱 레이어에서 배열로 다루고, SQLite 저장 시 bitmask로 변환합니다.
 *
 * @property {number} id - 알람 고유 ID
 * @property {number} hour - 알람 시간 (시)
 * @property {number} minute - 알람 시간 (분)
 * @property {WorkType} workTypeTitle - 근무 유형
 * @property {number[]} weekdays - 반복 요일 (0: 일요일, 1: 월요일, ...)
 * @property {boolean} isEnabled - 알람 활성화 여부
 * @property {boolean} isHolidayDisabled - 휴일 알람 비활성화 여부
 * @property {boolean} isSnoozeEnabled - 스누즈 활성화 여부
 * @property {number} snoozeIntervalMinutes - 스누즈 간격 (분)
 * @property {number} snoozeRepeatCount - 스누즈 반복 횟수
 * @property {number} nextTriggerAtMillis - 다음 트리거 시간 (밀리초)
 * @property {number} createdAt - 생성 시간 (밀리초)
 * @property {number} updatedAt - 수정 시간 (밀리초)
 */
export interface AutoAlarmEntity {
  id: number
  hour: number
  minute: number
  workTypeTitle: WorkType
  weekdays: number[]
  isEnabled: boolean
  isHolidayDisabled: boolean
  isSnoozeEnabled: boolean
  snoozeIntervalMinutes: number
  snoozeRepeatCount: number
  nextTriggerAtMillis: number
  createdAt: number
  updatedAt: number
}
