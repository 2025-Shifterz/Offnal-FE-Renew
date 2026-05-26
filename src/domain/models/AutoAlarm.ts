import { ShiftType } from './Calendar'

export interface AutoAlarm {
  id: number
  time: AlarmTime
  workTypeTitle: ShiftType
  weekdays: number[]
  isEnabled: boolean
  isHolidayDisabled: boolean
  snooze: AlarmSnooze
  nextTriggerAtMillis: number
}

export interface AlarmTime {
  hour: number
  minute: number
}

export interface AlarmSnooze {
  enabled: boolean
  intervalMinutes: number
  repeatCount: number
}
