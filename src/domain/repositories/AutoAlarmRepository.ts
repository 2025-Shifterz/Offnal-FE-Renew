import { WorkType } from '../models/Calendar'
import { AutoAlarm } from '../models/AutoAlarm'

export interface CreateAutoAlarmInput {
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
}

export interface UpdateAutoAlarmInput extends CreateAutoAlarmInput {
  id: number
}

export interface AutoAlarmRepository {
  getAllAutoAlarms(): Promise<AutoAlarm[]>

  getAutoAlarmById(id: number): Promise<AutoAlarm | undefined>

  addAutoAlarm(autoAlarm: CreateAutoAlarmInput): Promise<AutoAlarm>

  updateAutoAlarm(autoAlarm: UpdateAutoAlarmInput): Promise<AutoAlarm>

  toggleAutoAlarm(id: number, enabled: boolean): Promise<AutoAlarm>

  deleteAutoAlarms(ids: number[]): Promise<void>

  setAutoAlarmsEnabled(ids: number[], enabled: boolean): Promise<void>

  updateNextTriggerAtMillis(
    id: number,
    nextTriggerAtMillis: number
  ): Promise<void>

  deleteAutoAlarm(id: number): Promise<void>

  deleteAutoAlarmAll(): Promise<void>
}
