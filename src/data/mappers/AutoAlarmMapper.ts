import { AutoAlarm } from '../../domain/models/AutoAlarm'
import { AutoAlarmEntity } from '../../infrastructure/local/entities/AutoAlarmEntity'

export const toAutoAlarmDomain = (entity: AutoAlarmEntity): AutoAlarm => ({
  id: entity.id,
  time: { hour: entity.hour, minute: entity.minute },
  workTypeTitle: entity.workTypeTitle,
  weekdays: entity.weekdays,
  isEnabled: entity.isEnabled,
  isHolidayDisabled: entity.isHolidayDisabled,
  snooze: {
    enabled: entity.isSnoozeEnabled,
    intervalMinutes: entity.snoozeIntervalMinutes,
    repeatCount: entity.snoozeRepeatCount,
  },
  nextTriggerAtMillis: entity.nextTriggerAtMillis,
})

export const toAutoAlarmDomainArray = (
  entities: AutoAlarmEntity[]
): AutoAlarm[] => {
  return entities.map(entity => toAutoAlarmDomain(entity))
}
