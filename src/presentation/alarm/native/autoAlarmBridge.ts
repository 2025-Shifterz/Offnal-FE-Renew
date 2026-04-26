import { NativeModules, Platform } from 'react-native'

export interface AutoAlarmSyncItem {
  alarmId: number
  nextTriggerAtMillis: number
  isEnabled: boolean
}

type AutoAlarmNativeModule = {
  scheduleAlarm: (alarmId: number, nextTriggerAtMillis: number) => Promise<void>
  cancelAlarm: (alarmId: number) => Promise<void>
  syncEnabledAutoAlarms: (alarms: AutoAlarmSyncItem[]) => Promise<void>
}

const MODULE_NAME = 'AutoAlarmModule'

const getAutoAlarmNativeModule = (): AutoAlarmNativeModule | null => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return null
  }

  const nativeModule = (
    NativeModules as Record<string, AutoAlarmNativeModule | undefined>
  )[MODULE_NAME]

  if (!nativeModule) {
    throw new Error(
      'AutoAlarmModule is not linked. Make sure the Android or iOS native module is registered.'
    )
  }

  return nativeModule
}

export const scheduleAutoAlarm = async (
  alarmId: number,
  nextTriggerAtMillis: number
): Promise<void> => {
  const nativeModule = getAutoAlarmNativeModule()

  if (!nativeModule) {
    return
  }

  await nativeModule.scheduleAlarm(alarmId, nextTriggerAtMillis)
}

export const cancelAutoAlarm = async (alarmId: number): Promise<void> => {
  const nativeModule = getAutoAlarmNativeModule()

  if (!nativeModule) {
    return
  }

  await nativeModule.cancelAlarm(alarmId)
}

export const syncEnabledAutoAlarms = async (
  alarms: AutoAlarmSyncItem[]
): Promise<void> => {
  const nativeModule = getAutoAlarmNativeModule()

  if (!nativeModule) {
    return
  }

  await nativeModule.syncEnabledAutoAlarms(alarms)
}
