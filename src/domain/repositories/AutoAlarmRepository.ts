import { AutoAlarm } from '../models/AutoAlarm'

export interface AutoAlarmRepository {
  getAllAutoAlarms(): Promise<AutoAlarm[]>

  getAutoAlarmById(id: number): Promise<AutoAlarm | undefined>

  addAutoAlarm(autoAlarm: AutoAlarm): Promise<void>

  updateAutoAlarm(autoAlarm: AutoAlarm): Promise<void>

  updateNextTriggerAtMillis(
    id: number,
    nextTriggerAtMillis: number
  ): Promise<void>

  deleteAutoAlarm(id: number): Promise<void>

  deleteAutoAlarmAll(): Promise<void>
}
