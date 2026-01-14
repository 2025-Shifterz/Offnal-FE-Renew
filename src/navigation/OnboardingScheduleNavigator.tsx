import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OnboardingStackParamList } from './types'
import SelectScheduleScope from '../presentation/schedule/screens/SelectScheduleScopeScreen'
import StepBar from '../shared/components/StepBar'
import CustomBackButton from '../shared/components/CustomBackButton'
import CompleteScheduleScreen from '../presentation/schedule/screens/CompleteScheduleScreen'
import InputScheduleScreen from '../presentation/schedule/screens/InputScheduleScreen'
import InputCalendarTypeScreen from '../presentation/schedule/screens/InputCalendarTypeScreen'
import SelectScheduleRegScreen from '../presentation/schedule/screens/SelectScheduleRegScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import { TouchableOpacity } from 'react-native'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import React from 'react'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

// + 온보딩 화면들
const OnBoardingScheduleNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F4F5F6' },
      }}
    >
      <Stack.Screen
        name="SelectScheduleReg"
        component={SelectScheduleRegScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        // 근무표 범위 선택 - 전체 / 개인
        name="SelectScheduleScope"
        component={SelectScheduleScope}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={0} totalSteps={4} />}
              applySafeArea={true}
            />
          ),
        }}
      />
      <Stack.Screen
        // 근무표 기본 정보 입력
        name="InputSchedule"
        component={InputScheduleScreen}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={1} totalSteps={4} />}
              applySafeArea={true}
            />
          ),
        }}
      />
      <Stack.Screen
        // 달력에 근무 형태 입력
        name="InputCalendarType"
        component={InputCalendarTypeScreen}
        options={{
          header: () => (
            <CenterAlignedTopAppBar
              navigationIcon={<CustomBackButton />}
              title={<StepBar currentStep={2} totalSteps={4} />}
              applySafeArea={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name="CompleteSchedule"
        component={CompleteScheduleScreen}
        options={{
          header: () => (
            <CenterAlignedTopAppBar
              navigationIcon={<CustomBackButton />}
              title={<StepBar currentStep={3} totalSteps={4} />}
              applySafeArea={true}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleNavigator
