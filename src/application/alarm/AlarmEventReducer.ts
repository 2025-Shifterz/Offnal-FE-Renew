import {
  IosAlarmPlatformEvent,
  IosLegacyAlarmSessionState,
} from './types/alarmExecution'

export interface AlarmEventMutation {
  alarmId: number
  nextTriggerAtMillis?: number
  nextEnabledState: boolean
  nextSessionState: IosLegacyAlarmSessionState
  shouldReschedule: boolean
  snoozeRemainingCount?: number | null
}

export const reduceIosAlarmPlatformEvent = (
  event: IosAlarmPlatformEvent
): AlarmEventMutation => {
  if (event.type === 'snoozed') {
    return {
      alarmId: event.alarmId,
      nextTriggerAtMillis: event.nextTriggerAtMillis,
      nextEnabledState: true,
      nextSessionState: 'snoozed',
      shouldReschedule: true,
      snoozeRemainingCount: event.snoozeRemainingCount,
    }
  }

  return {
    alarmId: event.alarmId,
    nextEnabledState: false,
    nextSessionState: 'dismissed',
    shouldReschedule: false,
  }
}
