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
import Config from 'react-native-config'

enableScreens()

// Dev, Prod 환경에 따라 다른 API_URL이 설정되는지 확인
console.log('🔎 API_URL:', Config.API_URL)

function App() {
  const [isReady, setIsReady] = useState(false)

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
          <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
            <RootNavigator />
          </SafeAreaView>
        </WorkTimeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App
