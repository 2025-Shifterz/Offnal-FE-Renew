import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SplashScreen from '../presentation/splash/SplashScreen'
import TabsNavigator from './TabsNavigator'
import OnBoardingScheduleNavigator from './OnboardingScheduleNavigator'
import LoginNavigator from './LoginNavigator'
import { RootStackParamList } from './types/StackTypes'

// Migrate from MainNavigator.tsx
import TodoScreen from '../presentation/note/screens/TodoScreen'
import MemoScreen from '../presentation/note/screens/MemoScreen'
import AutoAlarm from '../presentation/alarm/screen/AutoAlarmScreen'
import AddMemoScreen from '../presentation/note/screens/AddMemoScreen'

// Migrate from CalendarNavigator.tsx
import CalendarEditScreen from '../presentation/calenderEditMode/screen/CalendarEditScreen'
import TCalendarEditScreen from '../presentation/calenderEditMode/screen/TCalendarEditScreen'
import CalendarInfoEditScreen from '../presentation/calendarInfoEdit/screen/CalendarInfoEditScreen'

// Migrate from MyInfoNavigator.tsx
import EditProfileScreen from '../presentation/info/screen/EditProfileScreen'
import FeedBackScreen from '../presentation/info/screen/FeedBackScreen'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'
import WithdrawBeforeScreen from '../presentation/info/screen/WithdrawBeforeScreen'
import WithdrawScreen from '../presentation/info/screen/WithdrawScreen'

// Migrate from OnboardingNavigator.tsx
import OnboardingMethodScreen from '../presentation/onboarding/screens/OnboardingMethodScreen'

// Migrate from AutoAlarmNavigator.tsx
import CreateAlarmScreen from '../presentation/alarm/screen/CreateAlarmScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../shared/components/button/TopAppBarBackButton'
import GlobalText from '../shared/components/GlobalText'

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
        />
        <RootStack.Screen
          name="OnboardingSchedules"
          component={OnBoardingScheduleNavigator}
        />

        <RootStack.Screen name="Tabs" component={TabsNavigator} />

        {/* Migrate from MainNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen name="AutoAlarm" component={AutoAlarm} />
        <RootStack.Screen
          name="Todo"
          component={TodoScreen}
          options={({ navigation }) => {
            return {
              header: () => (
                <CenterAlignedTopAppBar
                  navigationIcon={
                    <TopAppBarBackButton onPress={navigation.goBack} />
                  }
                  title={
                    <GlobalText className="font-pretSemiBold text-heading-xs">
                      할 일
                    </GlobalText>
                  }
                  applySafeArea={true}
                />
              ),
              headerShown: true,
              headerShadowVisible: false,
            }
          }}
        />
        <RootStack.Screen name="Memo" component={MemoScreen} />
        <RootStack.Screen name="AddMemo" component={AddMemoScreen} />

        {/* Migrate from CalendarNavigator.tsx - Flattened for Tab Bar Hiding */}
        <RootStack.Screen name="EditCalendar" component={CalendarEditScreen} />
        <RootStack.Screen
          name="TeamEditCalendar"
          component={TCalendarEditScreen}
        />
        <RootStack.Screen
          name="CalendarInfoEdit"
          component={CalendarInfoEditScreen}
        />

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
          options={({ navigation }) => {
            return {
              header: () => (
                <CenterAlignedTopAppBar
                  navigationIcon={
                    <TopAppBarBackButton onPress={navigation.goBack} />
                  }
                  title={
                    <GlobalText className="font-pretSemiBold text-heading-xs">
                      회원 탈퇴
                    </GlobalText>
                  }
                  applySafeArea={true}
                />
              ),
              headerShown: true,
              headerShadowVisible: false,
            }
          }}
        />
        <RootStack.Screen
          name="WithdrawScreen"
          component={WithdrawScreen}
          options={({ navigation }) => {
            return {
              header: () => (
                <CenterAlignedTopAppBar
                  navigationIcon={
                    <TopAppBarBackButton onPress={navigation.goBack} />
                  }
                  title={
                    <GlobalText className="font-pretSemiBold text-heading-xs">
                      회원 탈퇴
                    </GlobalText>
                  }
                  applySafeArea={true}
                />
              ),
              headerShown: true,
              headerShadowVisible: false,
            }
          }}
        />

        {/* Migrate from AutoAlarmNavigator.tsx */}
        <RootStack.Screen name="CreateAlarm" component={CreateAlarmScreen} />
        {/* <RootStack.Screen name="EditAutoAlarm" component={} /> */}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
