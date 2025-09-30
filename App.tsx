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
import { useEffect } from 'react'
import { createTodoTable } from './src/infrastructure/local/tables/TodoTable'
import { View } from 'react-native'

function App() {
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await createTodoTable() // 앱 시작 시 테이블 생성
        console.log('Todo table created!')
      } catch (error) {
        console.error('Error creating todo table:', error)
      }
    }

    initializeDB()
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
