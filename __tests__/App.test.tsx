import React from 'react'
import { render, waitFor } from '@testing-library/react-native'

const mockInitializeDataBaseTables = jest.fn()
const mockHolidayExecute = jest.fn()
const mockSyncEnabledAutoAlarms = jest.fn()
const mockFetchAllAutoAlarms = jest.fn()
const mockSetAutoAlarmsEnabled = jest.fn()

let mockAutoAlarms = [
  {
    id: 1,
    nextTriggerAtMillis: 1710000000000,
    isEnabled: true,
  },
  {
    id: 2,
    nextTriggerAtMillis: 1710003600000,
    isEnabled: false,
  },
]

jest.mock('../src/infrastructure/local/databaseInitialization', () => ({
  initializeDataBaseTables: mockInitializeDataBaseTables,
}))

jest.mock('../src/infrastructure/di/Dependencies', () => ({
  getHolidayDateSetUseCase: {
    execute: mockHolidayExecute,
  },
}))

jest.mock('../src/store/useAutoAlarmStore', () => ({
  useAutoAlarmStore: {
    getState: () => ({
      fetchAllAutoAlarms: mockFetchAllAutoAlarms,
      setAutoAlarmsEnabled: mockSetAutoAlarmsEnabled,
      autoAlarms: mockAutoAlarms,
    }),
  },
}))

jest.mock('../src/presentation/alarm/native/autoAlarmBridge', () => ({
  syncEnabledAutoAlarms: mockSyncEnabledAutoAlarms,
}))

jest.mock('../src/navigation/RootNavigator', () => () => null)

jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

jest.mock('@gorhom/portal', () => ({
  PortalProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) =>
    children,
}))

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}))

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
  },
  request: jest.fn().mockResolvedValue('granted'),
}))

describe('App', () => {
  const fixedNow = 1700000000000

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Date, 'now').mockReturnValue(fixedNow)
    mockAutoAlarms = [
      {
        id: 1,
        nextTriggerAtMillis: 1710000000000,
        isEnabled: true,
      },
      {
        id: 2,
        nextTriggerAtMillis: 1710003600000,
        isEnabled: false,
      },
    ]

    mockFetchAllAutoAlarms.mockImplementation(async () => {
      mockAutoAlarms = [
        {
          id: 1,
          nextTriggerAtMillis: 1710000000000,
          isEnabled: true,
        },
        {
          id: 2,
          nextTriggerAtMillis: 1710003600000,
          isEnabled: false,
        },
      ]
    })
    mockInitializeDataBaseTables.mockResolvedValue(undefined)
    mockHolidayExecute.mockResolvedValue(undefined)
    mockSyncEnabledAutoAlarms.mockResolvedValue(undefined)
    mockSetAutoAlarmsEnabled.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('initializes the database and syncs auto alarms on app start', async () => {
    const App = require('../App').default as React.ComponentType

    render(<App />)

    await waitFor(() => {
      expect(mockInitializeDataBaseTables).toHaveBeenCalled()
      expect(mockHolidayExecute).toHaveBeenCalled()
      expect(mockFetchAllAutoAlarms).toHaveBeenCalled()
      expect(mockSyncEnabledAutoAlarms).toHaveBeenCalledWith([
        {
          alarmId: 1,
          nextTriggerAtMillis: 1710000000000,
          isEnabled: true,
        },
      ])
    })
  })
})
