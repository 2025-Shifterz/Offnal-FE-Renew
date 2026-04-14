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
import { getHolidayDateSetUseCase } from './src/infrastructure/di/Dependencies'
import { useAutoAlarmStore } from './src/store/useAutoAlarmStore'
import { syncEnabledAutoAlarms } from './src/presentation/alarm/native/autoAlarmBridge'

enableScreens()

const getHolidayDateSet = async (): Promise<void> => {
  const year = dayjs().year().toString()

  await getHolidayDateSetUseCase.execute(year)
}

const syncAutoAlarmsOnAppStart = async (): Promise<void> => {
  await useAutoAlarmStore.getState().fetchAllAutoAlarms()

  const autoAlarms = useAutoAlarmStore.getState().autoAlarms

  await syncEnabledAutoAlarms(
    autoAlarms.map(autoAlarm => ({
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
        await syncAutoAlarmsOnAppStart()
      } catch (error) {
        console.error('Error syncing auto alarms on app start', error)
      }

      if (!isCanceled) {
        setIsReady(true)
      }
    }

    void init()

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
