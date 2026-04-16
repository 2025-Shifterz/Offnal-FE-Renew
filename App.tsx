import './global.css'
import { useEffect, useState } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/databaseInitialization'
import { ActivityIndicator, View, StatusBar } from 'react-native'
import RootNavigator from './src/navigation/RootNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import { Platform } from 'react-native'
import { getHolidayDateSetUseCase } from './src/infrastructure/di/Dependencies'
import { useAutoAlarmStore } from './src/store/useAutoAlarmStore'
import { syncEnabledAutoAlarms } from './src/presentation/alarm/native/autoAlarmBridge'

enableScreens()

const getHolidayDateSet = async (): Promise<void> => {
  const currentYear = dayjs().year()

  await Promise.all([
    getHolidayDateSetUseCase.execute(currentYear.toString()),
    getHolidayDateSetUseCase.execute((currentYear + 1).toString()),
  ])
}

const requestNotificationPermission = async (): Promise<void> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return
  }

  const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS
  const status = await request(permission)

  if (status !== RESULTS.GRANTED) {
    console.warn('Notification permission not granted:', status)
  }
}

const syncAutoAlarmsOnAppStart = async (): Promise<void> => {
  await useAutoAlarmStore.getState().fetchAllAutoAlarms()

  const now = Date.now()
  const autoAlarmStore = useAutoAlarmStore.getState()
  const staleAlarmIds = autoAlarmStore.autoAlarms
    .filter(alarm => alarm.isEnabled && alarm.nextTriggerAtMillis <= now)
    .map(alarm => alarm.id)

  if (staleAlarmIds.length > 0) {
    await autoAlarmStore.setAutoAlarmsEnabled(staleAlarmIds, false)
  }

  await syncEnabledAutoAlarms(
    useAutoAlarmStore
      .getState()
      .autoAlarms.filter(
        autoAlarm => autoAlarm.isEnabled && autoAlarm.nextTriggerAtMillis > now
      )
      .map(autoAlarm => ({
        alarmId: autoAlarm.id,
        nextTriggerAtMillis: autoAlarm.nextTriggerAtMillis,
        isEnabled: autoAlarm.isEnabled,
      }))
  )
}

function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isCanceled = false

    const init = async () => {
      try {
        await initializeDataBaseTables()
      } catch (error) {
        console.error('Error creating DB tables', error)
      }

      try {
        await getHolidayDateSet()
      } catch (error) {
        console.error('Error caching holiday data', error)
      }

      try {
        await requestNotificationPermission()
      } catch (error) {
        console.error('Error requesting notification permission', error)
      }

      try {
        await syncAutoAlarmsOnAppStart()
      } catch (error) {
        console.error('Error syncing auto alarms on app start', error)
      }

      if (!isCanceled) {
        setIsReady(true)
      }
    }

    init().catch(error => {
      console.error('Unexpected app init failure', error)
    })

    return () => {
      isCanceled = true
    }
  }, [])

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <PortalProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
              <RootNavigator />
            </SafeAreaView>
          </PortalProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App
