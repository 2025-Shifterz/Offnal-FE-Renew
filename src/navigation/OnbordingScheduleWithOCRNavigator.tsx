import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SelectMonthWithOCRScreen from '../presentation/schedule/screens/ocr/SelectMonthWithOCRScreen'
import EditScheduleOCRScreen from '../presentation/schedule/screens/ocr/EditScheduleOCRScreen'
import { OnboardingStackParamList } from './types'
import ScheduleRegTypeOCR from '../presentation/schedule/screens/ocr/SelectScheduleScopeOCRScreen'
import ScheduleInfoInputOCR from '../presentation/schedule/screens/ocr/InputScheduleOCRScreen'
import CustomBackButton from '../shared/components/CustomBackButton'
import StepBar from '../shared/components/StepBar'
import CompleteScheduleOCRScreen from '../presentation/schedule/screens/ocr/CompleteScheduleOCRScreen'
import SelectPhotoOCRScreen from '../presentation/schedule/screens/ocr/SelectPhotoOCRScreen'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

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
        name="ScheduleRegType"
        component={ScheduleRegTypeOCR}
        options={{
          headerTitle: () => <StepBar currentStep={0} totalSteps={6} />,
        }}
      />
      <Stack.Screen
        name="ScheduleInfoInput"
        component={ScheduleInfoInputOCR}
        options={{
          headerTitle: () => <StepBar currentStep={1} totalSteps={6} />,
        }}
      />
      <Stack.Screen
        name="SelectMonthWithOCR"
        component={SelectMonthWithOCRScreen}
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
