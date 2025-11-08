import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainScreen from '../presentation/main/screen/MainScreen'
import TodoScreen from '../presentation/note/screens/TodoScreen'
import MemoScreen from '../presentation/note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarm'
import { MainStackParamList } from './types'
import CustomBackButton from '../shared/components/CustomBackButton'
import AddMemoScreen from '../presentation/note/screens/AddMemoScreen'

// 탭1. 메인 탭에 사용되는 스택 네비게이터
const Stack = createNativeStackNavigator<MainStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F4F5F6' },
        headerLeft: () => <CustomBackButton />,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AutoAlarm"
        options={{ title: '자동 알람' }}
        component={AutoAlarm}
      />
      <Stack.Screen
        name="Todo"
        component={TodoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Memo"
        component={MemoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMemo"
        component={AddMemoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
export default MainNavigator
