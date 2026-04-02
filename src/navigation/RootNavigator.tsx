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
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../shared/components/button/TopAppBarBackButton'
import GlobalText from '../shared/components/text/GlobalText'

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
          options={() => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={null}
                title={null}
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
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
          options={({ navigation }) => ({
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
          })}
        />
        <RootStack.Screen
          name="Memo"
          component={MemoScreen}
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    메모
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <RootStack.Screen
          name="AddMemo"
          component={AddMemoScreen}
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={null}
                applySafeArea={true}
                backgroundColor="bg-surface-white"
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
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
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    프로필 수정
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
        />

        <RootStack.Screen
          name="FeedbackScreen"
          component={FeedBackScreen}
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    평가 및 피드백
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
        />

        <RootStack.Screen
          name="TermsWebViewScreen"
          component={TermsWebViewScreen}
          options={({ navigation, route }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    {route.params.title}
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
        />

        <RootStack.Screen
          name="WithdrawBeforeScreen"
          component={WithdrawBeforeScreen}
          options={({ navigation }) => ({
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
          })}
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
        <RootStack.Screen
          name="CreateAlarm"
          component={CreateAutoAlarmScreen}
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    알람 생성
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
        />
        <RootStack.Screen
          name="AutoAlarm"
          component={AutoAlarm}
          options={({ navigation }) => ({
            header: () => (
              <CenterAlignedTopAppBar
                navigationIcon={
                  <TopAppBarBackButton onPress={navigation.goBack} />
                }
                title={
                  <GlobalText className="font-pretSemiBold text-heading-xs">
                    자동 알람
                  </GlobalText>
                }
                applySafeArea={true}
              />
            ),
            headerShown: true,
            headerShadowVisible: false,
          })}
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
