import { Platform } from 'react-native'
import { AutoAlarm } from '../../domain/models/AutoAlarm'
import { autoAlarmRepository } from '../../infrastructure/di/Dependencies'
import {
  cancelAutoAlarm as cancelNativeAutoAlarm,
  scheduleAutoAlarm as scheduleNativeAutoAlarm,
  syncEnabledAutoAlarms as syncNativeAutoAlarms,
} from '../../presentation/alarm/native/autoAlarmBridge'
import { reduceIosAlarmPlatformEvent } from './AlarmEventReducer'
import { toAlarmSyncItem } from './AlarmDomainService'
import { IosAlarmKitStrategy } from './strategies/IosAlarmKitStrategy'
import { IosLegacyAlarmStrategy } from './strategies/IosLegacyAlarmStrategy'
import {
  AlarmSyncItem,
  IosAlarmCapability,
  IosAlarmExecutionStrategy,
} from './types/alarmExecution'

const legacyStrategy = new IosLegacyAlarmStrategy()
const alarmKitStrategy = new IosAlarmKitStrategy()

const defaultCapabilities: IosAlarmCapability = {
  alarmKitAvailable: false,
  alarmKitAuthorizationStatus: 'unsupported',
  notificationAuthorizationStatus: 'unsupported',
  preferredStrategy: 'legacy',
}

const resolveCapabilities = async (): Promise<IosAlarmCapability> => {
  const alarmKitCapabilities = await alarmKitStrategy.getCapabilities()
  const mergedCapabilities: IosAlarmCapability = {
    ...defaultCapabilities,
    ...alarmKitCapabilities,
  }

  const preferredStrategy =
    mergedCapabilities.alarmKitAvailable &&
    mergedCapabilities.alarmKitAuthorizationStatus !== 'denied'
      ? 'alarmKit'
      : 'legacy'

  return {
    ...mergedCapabilities,
    preferredStrategy,
  }
}

const resolveIosStrategy = async (): Promise<IosAlarmExecutionStrategy> => {
  const capabilities = await resolveCapabilities()
  return capabilities.preferredStrategy === 'alarmKit'
    ? alarmKitStrategy
    : legacyStrategy
}

const cancelInactiveStrategyArtifacts = async (
  strategy: IosAlarmExecutionStrategy,
  items: AlarmSyncItem[]
): Promise<void> => {
  const alarmIds = [...new Set(items.map(item => item.alarmId))]

  if (strategy.kind === 'alarmKit') {
    await legacyStrategy.sync(
      items.map(item => ({
        ...item,
        isEnabled: false,
      }))
    )
    return
  }

  await Promise.all(
    alarmIds.map(async alarmId => alarmKitStrategy.disarm(alarmId))
  )
}

const scheduleOnCurrentPlatform = async (
  item: AlarmSyncItem
): Promise<void> => {
  if (Platform.OS !== 'ios') {
    if (item.isEnabled) {
      await scheduleNativeAutoAlarm(item.alarmId, item.nextTriggerAtMillis)
      return
    }

    await cancelNativeAutoAlarm(item.alarmId)
    return
  }

  const strategy = await resolveIosStrategy()
  await cancelInactiveStrategyArtifacts(strategy, [item])
  await strategy.arm(item)
}

const syncOnCurrentPlatform = async (items: AlarmSyncItem[]): Promise<void> => {
  if (items.length === 0) {
    return
  }

  if (Platform.OS !== 'ios') {
    await syncNativeAutoAlarms(
      items.map(item => ({
        alarmId: item.alarmId,
        nextTriggerAtMillis: item.nextTriggerAtMillis,
        isEnabled: item.isEnabled,
      }))
    )
    return
  }

  const strategy = await resolveIosStrategy()
  await cancelInactiveStrategyArtifacts(strategy, items)
  await strategy.sync(items)
}

const cancelOnCurrentPlatform = async (alarmId: number): Promise<void> => {
  if (Platform.OS !== 'ios') {
    await cancelNativeAutoAlarm(alarmId)
    return
  }

  await Promise.all([
    legacyStrategy.disarm(alarmId),
    alarmKitStrategy.disarm(alarmId),
  ])
}

export const alarmSchedulerFacade = {
  async getCapabilities(): Promise<IosAlarmCapability> {
    if (Platform.OS !== 'ios') {
      return defaultCapabilities
    }

    return resolveCapabilities()
  },

  async scheduleAutoAlarm(
    autoAlarm: AutoAlarm,
    overrides?: Partial<AlarmSyncItem>
  ): Promise<void> {
    await scheduleOnCurrentPlatform(toAlarmSyncItem(autoAlarm, overrides))
  },

  async cancelAutoAlarm(alarmId: number): Promise<void> {
    await cancelOnCurrentPlatform(alarmId)
  },

  async syncAutoAlarms(items: AlarmSyncItem[] | AutoAlarm[]): Promise<void> {
    const normalizedItems = items.map(item =>
      'alarmId' in item ? item : toAlarmSyncItem(item)
    )

    await syncOnCurrentPlatform(normalizedItems)
  },

  async processPendingPlatformEvents(): Promise<void> {
    if (Platform.OS !== 'ios') {
      return
    }

    const events = await legacyStrategy.consumePendingEvents()
    const sortedEvents = [...events].sort(
      (left, right) => left.occurredAtMillis - right.occurredAtMillis
    )

    for (const event of sortedEvents) {
      const mutation = reduceIosAlarmPlatformEvent(event)

      if (mutation.nextTriggerAtMillis !== undefined) {
        await autoAlarmRepository.updateNextTriggerAtMillis(
          mutation.alarmId,
          mutation.nextTriggerAtMillis
        )
      }

      await autoAlarmRepository.setAutoAlarmsEnabled(
        [mutation.alarmId],
        mutation.nextEnabledState
      )

      if (!mutation.shouldReschedule) {
        await cancelOnCurrentPlatform(mutation.alarmId)
        continue
      }

      const autoAlarm = await autoAlarmRepository.getAutoAlarmById(
        mutation.alarmId
      )
      if (!autoAlarm) {
        await cancelOnCurrentPlatform(mutation.alarmId)
        continue
      }

      const baseSyncItem = toAlarmSyncItem(autoAlarm)
      await scheduleOnCurrentPlatform({
        ...baseSyncItem,
        nextTriggerAtMillis:
          mutation.nextTriggerAtMillis ?? autoAlarm.nextTriggerAtMillis,
        snooze: {
          ...baseSyncItem.snooze,
          remainingCount: mutation.snoozeRemainingCount,
        },
      })
    }
  },
}
