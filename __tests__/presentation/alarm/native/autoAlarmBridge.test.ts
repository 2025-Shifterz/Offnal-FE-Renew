const scheduleAlarm = jest.fn()
const cancelAlarm = jest.fn()
const syncEnabledAutoAlarms = jest.fn()

const setReactNativeMock = (platformOS: 'android' | 'ios') => {
  jest.doMock('react-native', () => ({
    NativeModules: {
      AutoAlarmModule: {
        scheduleAlarm,
        cancelAlarm,
        syncEnabledAutoAlarms,
      },
    },
    Platform: {
      OS: platformOS,
    },
  }))
}

const loadBridge = (platformOS: 'android' | 'ios') => {
  setReactNativeMock(platformOS)

  return require('../../../../src/presentation/alarm/native/autoAlarmBridge') as {
    scheduleAutoAlarm: (
      alarmId: number,
      nextTriggerAtMillis: number
    ) => Promise<void>
    cancelAutoAlarm: (alarmId: number) => Promise<void>
    syncEnabledAutoAlarms: (
      alarms: Array<{
        alarmId: number
        nextTriggerAtMillis: number
        isEnabled: boolean
      }>
    ) => Promise<void>
  }
}

describe('autoAlarmBridge', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('passes schedule requests to the android native module', async () => {
    const { scheduleAutoAlarm } = loadBridge('android')

    await scheduleAutoAlarm(7, 123456789)

    expect(scheduleAlarm).toHaveBeenCalledWith(7, 123456789)
    expect(cancelAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('passes cancel requests to the android native module', async () => {
    const { cancelAutoAlarm } = loadBridge('android')

    await cancelAutoAlarm(12)

    expect(cancelAlarm).toHaveBeenCalledWith(12)
    expect(scheduleAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('passes sync requests to the android native module', async () => {
    const { syncEnabledAutoAlarms: syncEnabledAutoAlarmsBridge } =
      loadBridge('android')

    const payload = [
      {
        alarmId: 1,
        nextTriggerAtMillis: 1000,
        isEnabled: true,
      },
    ]

    await syncEnabledAutoAlarmsBridge(payload)

    expect(syncEnabledAutoAlarms).toHaveBeenCalledWith(payload)
    expect(scheduleAlarm).not.toHaveBeenCalled()
    expect(cancelAlarm).not.toHaveBeenCalled()
  })

  it('does nothing on non-android platforms', async () => {
    const {
      scheduleAutoAlarm,
      cancelAutoAlarm,
      syncEnabledAutoAlarms: syncEnabledAutoAlarmsBridge,
    } = loadBridge('ios')

    await scheduleAutoAlarm(1, 111)
    await cancelAutoAlarm(1)
    await syncEnabledAutoAlarmsBridge([
      {
        alarmId: 1,
        nextTriggerAtMillis: 111,
        isEnabled: true,
      },
    ])

    expect(scheduleAlarm).not.toHaveBeenCalled()
    expect(cancelAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })
})
