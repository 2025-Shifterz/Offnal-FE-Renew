import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainScreen from '../presentation/main/screen/MainScreen'
import TodoScreen from '../presentation/note/screens/TodoScreen'
import MemoScreen from '../presentation/note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarmScreen'
import { MainStackParamList } from './types'
import CustomBackButton from '../shared/components/CustomBackButton'
import AddMemoScreen from '../presentation/note/screens/AddMemoScreen'

// 탭1. 메인 탭에 사용되는 스택 네비게이터
const Stack = createNativeStackNavigator<MainStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F4F5F6' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="AutoAlarm" component={AutoAlarm} />
      <Stack.Screen name="Todo" component={TodoScreen} />
      <Stack.Screen name="Memo" component={MemoScreen} />
      <Stack.Screen name="AddMemo" component={AddMemoScreen} />
    </Stack.Navigator>
  )
}
export default MainNavigator
