/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MyPage from './src/presentation/MyPage/screen/MyPage'
import TodoScreen from './src/presentation/Note/screens/TodoScreen'
import MemoScreen from './src/presentation/Note/screens/MemoScreen'
import InformationScreen from './src/presentation/info/screen/InformationScreen'
import { useEffect, useState } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/initialization'
import { ActivityIndicator, View } from 'react-native'

function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDataBaseTables() // 앱 시작 시 테이블 생성
        console.log('DB tables created!')
      } catch (error) {
        console.error('Error creating DB tables:', error)
      }
    }

    init()
  }, [])

  return (
    <SafeAreaProvider>
      {/* <MyPage /> */}
      {/* <TodoScreen /> */}
      {/* <MemoScreen /> */}
      <InformationScreen />
    </SafeAreaProvider>
  )
}

export default App
