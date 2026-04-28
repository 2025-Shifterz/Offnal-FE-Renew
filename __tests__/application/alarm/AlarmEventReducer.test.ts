import { reduceIosAlarmPlatformEvent } from '../../../src/application/alarm/AlarmEventReducer'

describe('reduceIosAlarmPlatformEvent', () => {
  it('returns a reschedule mutation for snoozed events', () => {
    const result = reduceIosAlarmPlatformEvent({
      eventId: 'event-1',
      alarmId: 42,
      type: 'snoozed',
      occurredAtMillis: 1_700_000_000_000,
      nextTriggerAtMillis: 1_700_000_300_000,
      snoozeRemainingCount: 2,
      sessionState: 'snoozed',
      source: 'legacyNotificationAction',
    })

    expect(result).toEqual({
      alarmId: 42,
      nextTriggerAtMillis: 1_700_000_300_000,
      nextEnabledState: true,
      nextSessionState: 'snoozed',
      shouldReschedule: true,
      snoozeRemainingCount: 2,
    })
  })

  it('disables alarms for dismissed events', () => {
    const result = reduceIosAlarmPlatformEvent({
      eventId: 'event-2',
      alarmId: 7,
      type: 'dismissed',
      occurredAtMillis: 1_700_000_000_000,
      sessionState: 'dismissed',
      source: 'legacyNotificationAction',
    })

    expect(result).toEqual({
      alarmId: 7,
      nextEnabledState: false,
      nextSessionState: 'dismissed',
      shouldReschedule: false,
    })
  })
})
