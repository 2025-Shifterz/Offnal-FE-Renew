/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-reanimated'
import './global.css'
import { useEffect, useState } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/initialization'
import { ActivityIndicator, View } from 'react-native'
import RootNavigator from './src/navigation/RootNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { WorkTimeProvider } from './src/shared/context/WorkTimeContext'
import { enableScreens } from 'react-native-screens'
enableScreens()

function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDataBaseTables() // 앱 시작 시 테이블 생성
        console.log('DB tables created | Auth store rehydrated')
      } catch (error) {
        console.error(
          'Error creating DB tables | Auth store rehydration:',
          error
        )
      } finally {
        setIsReady(true)
      }
    }

    init()
  }, [])

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
          <RootNavigator />
        </WorkTimeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App
