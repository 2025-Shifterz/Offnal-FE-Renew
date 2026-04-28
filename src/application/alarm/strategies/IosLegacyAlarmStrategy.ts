import { NativeModules, Platform } from 'react-native'
import {
  AlarmSyncItem,
  IosAlarmCapability,
  IosAlarmExecutionStrategy,
  IosAlarmPlatformEvent,
} from '../types/alarmExecution'

type IosLegacyAlarmNativeModule = {
  scheduleAlarmItem: (item: AlarmSyncItem) => Promise<void>
  cancelAlarm: (alarmId: number) => Promise<void>
  syncAlarmItems: (items: AlarmSyncItem[]) => Promise<void>
  consumePendingEvents: () => Promise<IosAlarmPlatformEvent[]>
}

const MODULE_NAME = 'AutoAlarmModule'

const getNativeModule = (): IosLegacyAlarmNativeModule | null => {
  if (Platform.OS !== 'ios') {
    return null
  }

  const nativeModule = (
    NativeModules as Record<string, IosLegacyAlarmNativeModule | undefined>
  )[MODULE_NAME]

  if (!nativeModule) {
    throw new Error('AutoAlarmModule is not linked on iOS.')
  }

  return nativeModule
}

export class IosLegacyAlarmStrategy implements IosAlarmExecutionStrategy {
  readonly kind = 'legacy' as const

  async arm(item: AlarmSyncItem): Promise<void> {
    const nativeModule = getNativeModule()
    if (!nativeModule) {
      return
    }

    if (!item.isEnabled) {
      await nativeModule.cancelAlarm(item.alarmId)
      return
    }

    await nativeModule.scheduleAlarmItem(item)
  }

  async disarm(alarmId: number): Promise<void> {
    const nativeModule = getNativeModule()
    if (!nativeModule) {
      return
    }

    await nativeModule.cancelAlarm(alarmId)
  }

  async sync(items: AlarmSyncItem[]): Promise<void> {
    const nativeModule = getNativeModule()
    if (!nativeModule) {
      return
    }

    await nativeModule.syncAlarmItems(items)
  }

  async consumePendingEvents(): Promise<IosAlarmPlatformEvent[]> {
    const nativeModule = getNativeModule()
    if (!nativeModule) {
      return []
    }

    return nativeModule.consumePendingEvents()
  }

  async getCapabilities(): Promise<Partial<IosAlarmCapability>> {
    return {
      preferredStrategy: 'legacy',
    }
  }
}
