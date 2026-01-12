import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SplashScreen from '../presentation/splash/SplashScreen'
import TabsNavigator from './TabsNavigator'
import OnBoardingScheduleNavigator from './OnboardingScheduleNavigator'
import LoginNavigator from './LoginNavigator'
import OnBoardingScheduleOCRNavigator from './OnbordingScheduleOCRNavigator'
import { RootStackParamList } from './types'

// Migrate from MainNavigator.tsx
import TodoScreen from '../presentation/note/screens/TodoScreen'
import MemoScreen from '../presentation/note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarmScreen'
import AddMemoScreen from '../presentation/note/screens/AddMemoScreen'

// Migrate from CalendarNavigator.tsx
import CalendarScreen from '../presentation/calendar/screen/CalendarScreen'
import CalendarEditScreen from '../presentation/calenderEditMode/screen/CalendarEditScreen'
import TCalendarEditScreen from '../presentation/calenderEditMode/screen/TCalendarEditScreen'
import CalendarInfoEditScreen from '../presentation/calendarInfoEdit/screen/CalendarInfoEditScreen'

// Migrate from MyInfoNavigator.tsx
import EditProfileScreen from '../presentation/info/screen/EditProfileScreen'
import FeedBackScreen from '../presentation/info/screen/FeedBackScreen'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'
import WithdrawBeforeScreen from '../presentation/info/screen/WithdrawBeforeScreen'
import WithdrawScreen from '../presentation/info/screen/WithdrawScreen'

const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="LoginScreens" component={LoginNavigator} />
        <RootStack.Screen name="Tabs" component={TabsNavigator} />
        <RootStack.Screen
          name="OnboardingSchedules"
          component={OnBoardingScheduleNavigator}
        />
        <RootStack.Screen
          name="OnboardingSchedulesOCR"
          component={OnBoardingScheduleOCRNavigator}
        />
        {/* Migrate from MainNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen name="AutoAlarm" component={AutoAlarm} />
        <RootStack.Screen name="Todo" component={TodoScreen} />
        <RootStack.Screen name="Memo" component={MemoScreen} />
        <RootStack.Screen name="AddMemo" component={AddMemoScreen} />

        {/* Migrate from CalendarNavigator.tsx - Flattened for Tab Bar Hiding */}

        {/* Migrate from MyInfoNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
        />
        <RootStack.Screen name="FeedbackScreen" component={FeedBackScreen} />
        <RootStack.Screen
          name="TermsWebViewScreen"
          component={TermsWebViewScreen}
        />
        <RootStack.Screen
          name="WithdrawBeforeScreen"
          component={WithdrawBeforeScreen}
        />
        <RootStack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
