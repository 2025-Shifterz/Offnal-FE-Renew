import type {
  CreateAutoAlarmDraft,
  UpdateAutoAlarmDraft,
} from '../../src/presentation/alarm/types/alarmDraft'

const scheduleAutoAlarm = jest.fn()
const cancelAutoAlarm = jest.fn()
const syncEnabledAutoAlarms = jest.fn()
const resolveAutoAlarmNextTriggerAtMillis = jest.fn()
const createWorkTypeResolver = jest.fn()
const getHolidayDateSetExecute = jest.fn()

const autoAlarmRepository = {
  getAllAutoAlarms: jest.fn(),
  getAutoAlarmById: jest.fn(),
  addAutoAlarm: jest.fn(),
  updateAutoAlarm: jest.fn(),
  toggleAutoAlarm: jest.fn(),
  deleteAutoAlarms: jest.fn(),
  setAutoAlarmsEnabled: jest.fn(),
  updateNextTriggerAtMillis: jest.fn(),
  deleteAutoAlarm: jest.fn(),
  deleteAutoAlarmAll: jest.fn(),
}

const mockStoreDependencies = () => {
  jest.doMock('zustand/middleware/immer', () => ({
    immer: (config: unknown) => config,
  }))

  jest.doMock('../../src/presentation/alarm/native/autoAlarmBridge', () => ({
    cancelAutoAlarm,
    scheduleAutoAlarm,
    syncEnabledAutoAlarms,
  }))

  jest.doMock('../../src/infrastructure/di/Dependencies', () => ({
    autoAlarmRepository,
    getHolidayDateSetUseCase: {
      execute: getHolidayDateSetExecute,
    },
  }))

  jest.doMock(
    '../../src/shared/utils/alarm/resolveAutoAlarmNextTriggerAtMillis',
    () => ({
      resolveAutoAlarmNextTriggerAtMillis,
    })
  )

  jest.doMock('../../src/shared/utils/alarm/workTypeResolver', () => ({
    createWorkTypeResolver,
  }))

  jest.doMock('../../src/store/useCalendarStore', () => ({
    useCalendarStore: {
      getState: () => ({
        calendarData: [],
      }),
    },
  }))

  jest.doMock('../../src/store/useScheduleInfoStore', () => ({
    useScheduleInfoStore: {
      getState: () => ({
        workGroup: null,
      }),
    },
  }))

  jest.doMock('../../src/store/useTeamCalendarStore', () => ({
    useTeamCalendarStore: {
      getState: () => ({
        teamCalendarData: [],
        myTeam: null,
      }),
    },
  }))
}

const loadStore = () => {
  mockStoreDependencies()

  return require('../../src/store/useAutoAlarmStore') as {
    useAutoAlarmStore: {
      getState: () => {
        createAutoAlarm: (draft: CreateAutoAlarmDraft) => Promise<void>
        updateAutoAlarm: (draft: UpdateAutoAlarmDraft) => Promise<void>
        toggleAutoAlarm: (id: number, enabled: boolean) => Promise<void>
        deleteAutoAlarms: (ids: number[]) => Promise<void>
        setAutoAlarmsEnabled: (ids: number[], enabled: boolean) => Promise<void>
      }
    }
  }
}

const buildCreateDraft = (
  overrides: Partial<CreateAutoAlarmDraft> & { id?: number } = {}
): CreateAutoAlarmDraft & { id?: number } => ({
  alarmTime: new Date(2026, 3, 14, 7, 30, 0, 0),
  selectedWorkType: '주간',
  selectedDays: ['월', '수'],
  isHolidayAlarmOff: false,
  snoozeSetting: {
    enabled: true,
    intervalMinutes: 5,
    repeatCount: 3,
  },
  isEnabled: true,
  ...overrides,
})

describe('useAutoAlarmStore', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    resolveAutoAlarmNextTriggerAtMillis.mockResolvedValue(1710000000000)
    createWorkTypeResolver.mockReturnValue(jest.fn())
    getHolidayDateSetExecute.mockResolvedValue(new Set<number>())
    autoAlarmRepository.getAllAutoAlarms.mockResolvedValue([])
    autoAlarmRepository.getAutoAlarmById.mockResolvedValue(undefined)
  })

  it('schedules a newly created enabled auto alarm after saving', async () => {
    const createdAutoAlarm = {
      id: 7,
      time: { hour: 7, minute: 30 },
      workTypeTitle: '주간',
      weekdays: [1, 3],
      isEnabled: true,
      isHolidayDisabled: false,
      snooze: {
        enabled: true,
        intervalMinutes: 5,
        repeatCount: 3,
      },
      nextTriggerAtMillis: 1710000000000,
    }
    autoAlarmRepository.addAutoAlarm.mockResolvedValue(createdAutoAlarm)

    const { useAutoAlarmStore } = loadStore()

    await useAutoAlarmStore.getState().createAutoAlarm(buildCreateDraft())

    expect(autoAlarmRepository.addAutoAlarm).toHaveBeenCalledWith(
      expect.objectContaining({
        hour: 7,
        minute: 30,
        nextTriggerAtMillis: 1710000000000,
      })
    )
    expect(scheduleAutoAlarm).toHaveBeenCalledWith(7, 1710000000000)
    expect(cancelAutoAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('cancels a disabled alarm after update', async () => {
    const updatedAutoAlarm = {
      id: 9,
      time: { hour: 8, minute: 10 },
      workTypeTitle: '오후',
      weekdays: [2, 4],
      isEnabled: false,
      isHolidayDisabled: true,
      snooze: {
        enabled: false,
        intervalMinutes: 0,
        repeatCount: 0,
      },
      nextTriggerAtMillis: 1710003600000,
    }
    autoAlarmRepository.updateAutoAlarm.mockResolvedValue(updatedAutoAlarm)

    const { useAutoAlarmStore } = loadStore()

    await useAutoAlarmStore.getState().updateAutoAlarm(
      buildCreateDraft({
        id: 9,
        isEnabled: false,
        selectedWorkType: '오후',
        selectedDays: ['화', '목'],
        isHolidayAlarmOff: true,
        snoozeSetting: {
          enabled: false,
          intervalMinutes: 1,
          repeatCount: 'infinite',
        },
      }) as UpdateAutoAlarmDraft
    )

    expect(autoAlarmRepository.updateAutoAlarm).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 9,
        nextTriggerAtMillis: 1710000000000,
      })
    )
    expect(cancelAutoAlarm).toHaveBeenCalledWith(9)
    expect(scheduleAutoAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('schedules a toggled alarm and refreshes the cache when needed', async () => {
    const toggledAutoAlarm = {
      id: 11,
      time: { hour: 6, minute: 45 },
      workTypeTitle: '야간',
      weekdays: [1],
      isEnabled: true,
      isHolidayDisabled: false,
      snooze: {
        enabled: true,
        intervalMinutes: 10,
        repeatCount: 1,
      },
      nextTriggerAtMillis: 1710007200000,
    }
    autoAlarmRepository.toggleAutoAlarm.mockResolvedValue(toggledAutoAlarm)
    autoAlarmRepository.getAllAutoAlarms.mockResolvedValue([toggledAutoAlarm])

    const { useAutoAlarmStore } = loadStore()

    await useAutoAlarmStore.getState().toggleAutoAlarm(11, true)

    expect(autoAlarmRepository.toggleAutoAlarm).toHaveBeenCalledWith(11, true)
    expect(autoAlarmRepository.getAllAutoAlarms).toHaveBeenCalled()
    expect(scheduleAutoAlarm).toHaveBeenCalledWith(11, 1710007200000)
    expect(cancelAutoAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('cancels native alarms after deleting multiple ids', async () => {
    autoAlarmRepository.deleteAutoAlarms.mockResolvedValue(undefined)

    const { useAutoAlarmStore } = loadStore()

    await useAutoAlarmStore.getState().deleteAutoAlarms([3, 3, 4])

    expect(autoAlarmRepository.deleteAutoAlarms).toHaveBeenCalledWith([3, 4])
    expect(cancelAutoAlarm).toHaveBeenCalledTimes(2)
    expect(cancelAutoAlarm).toHaveBeenNthCalledWith(1, 3)
    expect(cancelAutoAlarm).toHaveBeenNthCalledWith(2, 4)
    expect(scheduleAutoAlarm).not.toHaveBeenCalled()
    expect(syncEnabledAutoAlarms).not.toHaveBeenCalled()
  })

  it('syncs a batch of enabled alarms through the native bridge', async () => {
    const storedAlarms = [
      {
        id: 21,
        time: { hour: 7, minute: 0 },
        workTypeTitle: '주간',
        weekdays: [1],
        isEnabled: true,
        isHolidayDisabled: false,
        snooze: {
          enabled: true,
          intervalMinutes: 5,
          repeatCount: 3,
        },
        nextTriggerAtMillis: 1710010800000,
      },
      {
        id: 22,
        time: { hour: 9, minute: 15 },
        workTypeTitle: '오후',
        weekdays: [2],
        isEnabled: true,
        isHolidayDisabled: false,
        snooze: {
          enabled: false,
          intervalMinutes: 0,
          repeatCount: 0,
        },
        nextTriggerAtMillis: 1710014400000,
      },
    ]
    autoAlarmRepository.setAutoAlarmsEnabled.mockResolvedValue(undefined)
    autoAlarmRepository.getAutoAlarmById
      .mockResolvedValueOnce(storedAlarms[0])
      .mockResolvedValueOnce(storedAlarms[1])

    const { useAutoAlarmStore } = loadStore()

    await useAutoAlarmStore.getState().setAutoAlarmsEnabled([21, 22], true)

    expect(autoAlarmRepository.setAutoAlarmsEnabled).toHaveBeenCalledWith(
      [21, 22],
      true
    )
    expect(syncEnabledAutoAlarms).toHaveBeenCalledWith([
      {
        alarmId: 21,
        nextTriggerAtMillis: 1710010800000,
        isEnabled: true,
      },
      {
        alarmId: 22,
        nextTriggerAtMillis: 1710014400000,
        isEnabled: true,
      },
    ])
    expect(scheduleAutoAlarm).not.toHaveBeenCalled()
    expect(cancelAutoAlarm).not.toHaveBeenCalled()
  })
})
