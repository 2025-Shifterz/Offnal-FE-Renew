import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CalendarScreen from '../presentation/calendar/screen/CalendarScreen'
import CalendarEditScreen from '../presentation/calenderEditMode/screen/CalendarEditScreen'
import { CalendarScreenStackParamList } from './types'
import CustomBackButton from '../shared/components/CustomBackButton'
import CalendarInfoEditScreen from '../presentation/calendarInfoEdit/screen/CalendarInfoEditScreen'

// 탭2. 캘린더 탭에 사용되는 스택 네비게이터
const Stack = createNativeStackNavigator<CalendarScreenStackParamList>()

const CalendarNavigator = () => {
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
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditCalendar"
        options={{ headerShown: false }}
        component={CalendarEditScreen}
      />
      <Stack.Screen
        name="CalendarInfoEdit"
        options={{ title: '근무표 정보 수정' }}
        component={CalendarInfoEditScreen}
      />
    </Stack.Navigator>
  )
}
export default CalendarNavigator
