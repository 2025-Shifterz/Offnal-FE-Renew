import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomBackButton from '../presentation/common/component/CustomBackButton'
import MainScreen from '../presentation/main/screen/MainScreen'
import TodoScreen from '../presentation/Note/screens/TodoScreen'
import MemoScreen from '../presentation/Note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarm'
import { MainStackParamList } from './types'

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
        options={{ title: '할 일' }}
        component={TodoScreen}
      />
      <Stack.Screen
        name="Memo"
        options={{ title: '메모' }}
        component={MemoScreen}
      />
    </Stack.Navigator>
  )
}
export default MainNavigator
