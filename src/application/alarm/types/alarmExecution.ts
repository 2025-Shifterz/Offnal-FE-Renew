export type AlarmAuthorizationStatus =
  | 'authorized'
  | 'denied'
  | 'notDetermined'
  | 'provisional'
  | 'ephemeral'
  | 'unsupported'

export type IosAlarmStrategyKind = 'legacy' | 'alarmKit'

export type IosLegacyAlarmSessionState =
  | 'idle'
  | 'armed'
  | 'ringing_primary'
  | 'ringing_fallback'
  | 'snoozed'
  | 'dismissed'
  | 'expired'
  | 'failed'

export interface AlarmSnoozeSyncConfig {
  enabled: boolean
  intervalMinutes: number
  repeatCount: number
  remainingCount?: number | null
}

export interface AlarmSyncItem {
  alarmId: number
  nextTriggerAtMillis: number
  isEnabled: boolean
  snooze: AlarmSnoozeSyncConfig
}

export interface IosAlarmPlatformEvent {
  eventId: string
  alarmId: number
  type: 'dismissed' | 'snoozed'
  occurredAtMillis: number
  nextTriggerAtMillis?: number
  snoozeRemainingCount?: number | null
  sessionState: IosLegacyAlarmSessionState
  source: 'legacyNotificationAction' | 'alarmKit'
}

export interface IosAlarmCapability {
  alarmKitAvailable: boolean
  alarmKitAuthorizationStatus: AlarmAuthorizationStatus
  notificationAuthorizationStatus: AlarmAuthorizationStatus
  preferredStrategy: IosAlarmStrategyKind
}

export interface IosAlarmExecutionStrategy {
  readonly kind: IosAlarmStrategyKind
  arm(item: AlarmSyncItem): Promise<void>
  disarm(alarmId: number): Promise<void>
  sync(items: AlarmSyncItem[]): Promise<void>
  consumePendingEvents(): Promise<IosAlarmPlatformEvent[]>
  getCapabilities(): Promise<Partial<IosAlarmCapability>>
}
