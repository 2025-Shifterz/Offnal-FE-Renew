import { WorkType } from './Calendar'

export interface AutoAlarm {
  id: number
  time: AlarmTime
  workTypeTitle: WorkType
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
  intervalMinutes: number
  repeatCount: number
}
