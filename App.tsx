/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyPage from './src/presentation/MyPage/screen/MyPage'
import TodoScreen from './src/presentation/Note/screens/TodoScreen'
import MemoScreen from './src/presentation/Note/screens/MemoScreen'
import { useEffect } from 'react'
import { initializeDataBaseTables } from './src/infrastructure/local/Initialization'
import { View } from 'react-native'

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
      <View style={{ flex: 1 }}>
        {/* <MyPage /> */}
        <TodoScreen />
        {/* <MemoScreen /> */}
      </View>
    </SafeAreaProvider>
  )
}

export default App
