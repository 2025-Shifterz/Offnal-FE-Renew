import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SplashScreen from '../presentation/splash/SplashScreen'
import TabsNavigator from './TabsNavigator'
import OnBoardingScheduleNavigator from './OnboardingScheduleNavigator'
import LoginNavigator from './LoginNavigator'
import { RootStackParamList } from './types/RootStackParamList'
import {
  emptyHeaderOptions,
  makeBackHeaderOptions,
} from './options/stackHeaderOptions'

// Migrate from MainNavigator.tsx
import TodoScreen from '../presentation/note/screens/TodoScreen'
import MemoScreen from '../presentation/note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarmScreen'
import AddMemoScreen from '../presentation/note/screens/AddMemoScreen'

// Migrate from CalendarNavigator.tsx
import CalendarEditScreen from '../presentation/calenderEditMode/screen/CalendarEditScreen'
import TCalendarEditScreen from '../presentation/calenderEditMode/screen/TCalendarEditScreen'

// Migrate from MyInfoNavigator.tsx
import EditProfileScreen from '../presentation/info/screen/EditProfileScreen'
import FeedBackScreen from '../presentation/info/screen/FeedBackScreen'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'
import WithdrawBeforeScreen from '../presentation/info/screen/WithdrawBeforeScreen'
import WithdrawScreen from '../presentation/info/screen/WithdrawScreen'

// Migrate from OnboardingNavigator.tsx
import OnboardingMethodScreen from '../presentation/onboarding/screens/OnboardingMethodScreen'

// Migrate from AutoAlarmNavigator.tsx
import CreateAutoAlarmScreen from '../presentation/alarm/screen/CreateAutoAlarmScreen'
import EditAutoAlarmScreen from '../presentation/alarm/screen/EditAutoAlarmScreen'

// Onboarding Navigation Error Screen
const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="LoginScreens" component={LoginNavigator} />
        <RootStack.Screen
          // OCR / NEW / DIRECT 선택 화면
          name="OnboardingMethodScreen"
          component={OnboardingMethodScreen}
          options={emptyHeaderOptions}
        />
        <RootStack.Screen
          name="OnboardingSchedules"
          component={OnBoardingScheduleNavigator}
        />

        <RootStack.Screen name="Tabs" component={TabsNavigator} />

        {/* Migrate from MainNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen
          name="Todo"
          component={TodoScreen}
          options={makeBackHeaderOptions('할 일')}
        />
        <RootStack.Screen
          name="Memo"
          component={MemoScreen}
          options={makeBackHeaderOptions('메모')}
        />
        <RootStack.Screen
          name="AddMemo"
          component={AddMemoScreen}
          options={makeBackHeaderOptions(null, {
            backgroundColor: 'bg-surface-white',
          })}
        />

        {/* Migrate from CalendarNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen name="EditCalendar" component={CalendarEditScreen} />
        <RootStack.Screen
          name="TeamEditCalendar"
          component={TCalendarEditScreen}
        />

        {/* Migrate from MyInfoNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={makeBackHeaderOptions('프로필 수정')}
        />

        <RootStack.Screen
          name="FeedbackScreen"
          component={FeedBackScreen}
          options={makeBackHeaderOptions('평가 및 피드백')}
        />

        <RootStack.Screen
          name="TermsWebViewScreen"
          component={TermsWebViewScreen}
          options={({ navigation, route }) =>
            makeBackHeaderOptions(route.params.title)({ navigation })
          }
        />

        <RootStack.Screen
          name="WithdrawBeforeScreen"
          component={WithdrawBeforeScreen}
          options={makeBackHeaderOptions('회원 탈퇴')}
        />
        <RootStack.Screen
          name="WithdrawScreen"
          component={WithdrawScreen}
          options={makeBackHeaderOptions('회원 탈퇴')}
        />

        {/* Migrate from AutoAlarmNavigator.tsx */}
        <RootStack.Screen
          name="CreateAlarm"
          component={CreateAutoAlarmScreen}
          options={makeBackHeaderOptions('알람 생성')}
        />
        <RootStack.Screen
          name="AutoAlarm"
          component={AutoAlarm}
          options={makeBackHeaderOptions('자동 알람')}
        />
        <RootStack.Screen
          name="EditAutoAlarm"
          component={EditAutoAlarmScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
