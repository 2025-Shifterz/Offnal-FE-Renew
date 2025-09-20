/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css'
import { StyleSheet, Text, View } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import MyPage from './src/presentation/MyPage/screen/MyPage'
import TodoScreen from './src/presentation/Note/screens/TodoScreen'
import MemoScreen from './src/presentation/Note/screens/MemoScreen'

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  )
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top, // 상단 노치 만큼 padding
          paddingBottom: safeAreaInsets.bottom, // 하단 홈 인디케이터 만큼 padding
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <MyPage />
      {/* <TodoScreen /> */}
      {/* <PlusIcon /> */}
      {/* <MemoScreen /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
