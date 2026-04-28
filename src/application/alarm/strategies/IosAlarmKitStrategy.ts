import { NativeModules, Platform } from 'react-native'
import {
  IosAlarmCapability,
  AlarmSyncItem,
  IosAlarmExecutionStrategy,
  IosAlarmPlatformEvent,
} from '../types/alarmExecution'

type AlarmKitNativeModule = {
  getCapabilities: () => Promise<Omit<IosAlarmCapability, 'preferredStrategy'>>
  scheduleAlarmItem: (item: AlarmSyncItem) => Promise<void>
  cancelAlarm: (alarmId: number) => Promise<void>
  syncAlarmItems: (items: AlarmSyncItem[]) => Promise<void>
}

const MODULE_NAME = 'AlarmPlatformModule'

const getNativeModule = (): AlarmKitNativeModule | null => {
  if (Platform.OS !== 'ios') {
    return null
  }

  return (
    (NativeModules as Record<string, AlarmKitNativeModule | undefined>)[
      MODULE_NAME
    ] ?? null
  )
}

export class IosAlarmKitStrategy implements IosAlarmExecutionStrategy {
  readonly kind = 'alarmKit' as const

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
    return []
  }

  async getCapabilities(): Promise<Partial<IosAlarmCapability>> {
    const nativeModule = getNativeModule()

    if (!nativeModule) {
      return {
        alarmKitAvailable: false,
        alarmKitAuthorizationStatus: 'unsupported',
      }
    }

    return nativeModule.getCapabilities()
  }
}
