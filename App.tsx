/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css'
import { useEffect, useState } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/initialization'
import { ActivityIndicator, View, StatusBar } from 'react-native'
import RootNavigator from './src/navigation/RootNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

enableScreens()

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
