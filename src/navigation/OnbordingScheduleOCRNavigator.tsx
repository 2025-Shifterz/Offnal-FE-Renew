import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SelectMonthOCRScreen from '../presentation/schedule/screens/ocr/SelectMonthOCRScreen'
import EditScheduleOCRScreen from '../presentation/schedule/screens/ocr/EditScheduleOCRScreen'
import { OnboardingOCRStackParamList } from './types'
import SelectScheduleScopeOCR from '../presentation/schedule/screens/ocr/SelectScheduleScopeOCRScreen'
import InputScheduleOCR from '../presentation/schedule/screens/ocr/InputScheduleOCRScreen'
import CustomBackButton from '../shared/components/CustomBackButton'
import StepBar from '../shared/components/StepBar'
import CompleteScheduleOCRScreen from '../presentation/schedule/screens/ocr/CompleteScheduleOCRScreen'
import SelectPhotoOCRScreen from '../presentation/schedule/screens/ocr/SelectPhotoOCRScreen'
import SelectScheduleRegScreen from '../presentation/schedule/screens/SelectScheduleRegScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import { TouchableOpacity } from 'react-native'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import React from 'react'

const Stack = createNativeStackNavigator<OnboardingOCRStackParamList>()

// + 온보딩 화면들
const OnBoardingScheduleWithOCRNavigator = () => {
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
      />
      <Stack.Screen
        // 근무표 범위 선택 - 전체 / 개인
        name="SelectScheduleScopeOCR"
        component={SelectScheduleScopeOCR}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={0} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name="InputScheduleOCR"
        component={InputScheduleOCR}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={1} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SelectMonthOCR"
        component={SelectMonthOCRScreen}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={2} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />

      <Stack.Screen
        name="SelectPhotoOCR"
        component={SelectPhotoOCRScreen}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={3} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />

      <Stack.Screen
        name="EditScheduleOCR"
        component={EditScheduleOCRScreen}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={4} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />

      <Stack.Screen
        name="CompleteScheduleOCR"
        component={CompleteScheduleOCRScreen}
        options={{
          header: ({ navigation }) => (
            <CenterAlignedTopAppBar
              navigationIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ArrowLeft width={24} height={24} />
                </TouchableOpacity>
              }
              title={<StepBar currentStep={5} totalSteps={6} />}
              applySafeArea={true}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleWithOCRNavigator
