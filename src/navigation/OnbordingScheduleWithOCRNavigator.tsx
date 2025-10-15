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

const Stack = createNativeStackNavigator<OnboardingOCRStackParamList>()

// + 온보딩 화면들
const OnBoardingScheduleWithOCRNavigator = () => {
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
        // 근무표 범위 선택 - 전체 / 개인
        name="SelectScheduleScopeOCR"
        component={SelectScheduleScopeOCR}
        options={{
          headerTitle: () => <StepBar currentStep={0} totalSteps={6} />,
        }}
      />
      <Stack.Screen
        name="InputScheduleOCR"
        component={InputScheduleOCR}
        options={{
          headerTitle: () => <StepBar currentStep={1} totalSteps={6} />,
        }}
      />
      <Stack.Screen
        name="SelectMonthOCR"
        component={SelectMonthOCRScreen}
        options={{
          headerTitle: () => <StepBar currentStep={2} totalSteps={6} />,
        }}
      />

      <Stack.Screen
        name="SelectPhotoOCR"
        component={SelectPhotoOCRScreen}
        options={{
          headerTitle: () => <StepBar currentStep={3} totalSteps={6} />,
        }}
      />

      <Stack.Screen
        name="EditScheduleOCR"
        component={EditScheduleOCRScreen}
        options={{
          headerTitle: () => <StepBar currentStep={4} totalSteps={6} />,
        }}
      />

      <Stack.Screen
        name="CompleteScheduleOCR"
        component={CompleteScheduleOCRScreen}
        options={{
          headerTitle: () => <StepBar currentStep={5} totalSteps={6} />,
        }}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleWithOCRNavigator
