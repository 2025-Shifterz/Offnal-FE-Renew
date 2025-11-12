/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css'
import { useEffect, useState } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/initialization'
import { ActivityIndicator, View } from 'react-native'
import RootNavigator from './src/navigation/RootNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { WorkTimeProvider } from './src/shared/context/WorkTimeContext'
import { enableScreens } from 'react-native-screens'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCalendarStore } from './src/store/useCalendarStore'

enableScreens()

function App() {
  const [isReady, setIsReady] = useState(false)
  const userCalendar = useCalendarStore(state => state.userCalendar)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDataBaseTables()
        console.log('DB tables created')
      } catch (error) {
        console.error('Error creating DB tables', error)
      } finally {
        setIsReady(true)
      }
    }

    init()
  }, [])

  // 캘린더 GET 요청을 위한 데이터가 늦게 로드되는 것 방지
  useEffect(() => {
    console.log('앱 진입 시 userCalendar 설정', userCalendar)
  }, [userCalendar])

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <WorkTimeProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
            <RootNavigator />
          </SafeAreaView>
        </WorkTimeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App
