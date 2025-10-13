import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CompleteCreateScheduleScreen from '../presentation/schedule/screens/CreateCompleteScheduleScreen'

import SelectMonthWithOCRScreen from '../presentation/schedule/screens/ocr/SelectMonthWithOCRScreen'
import SelectInputScheduleWithOCRTypeScreen from '../presentation/schedule/screens/ocr/SelectInputScheduleWithOCRTypeScreen'
import EditCompleteCreateScheduleOCRScreen from '../presentation/schedule/screens/ocr/CompleteScheduleOCRScreen'
import { OnboardingStackParamList } from './types'
import ScheduleRegTypeOCR from '../presentation/schedule/screens/ocr/RegTypeByScheduleOCRScreen'
import ScheduleInfoInputOCR from '../presentation/schedule/screens/ocr/InputScheduleInfoOCRScreen'
import CustomBackButton from '../shared/components/CustomBackButton'
import StepBar from '../shared/components/StepBar'

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
        name="SelectInputScheduleWithOCRType"
        component={SelectInputScheduleWithOCRTypeScreen}
        options={{
          headerTitle: () => <StepBar currentStep={3} totalSteps={6} />,
        }}
      />

      <Stack.Screen
        name="EditCompleteCreateScheduleOCR"
        component={EditCompleteCreateScheduleOCRScreen}
        options={{
          headerTitle: () => <StepBar currentStep={4} totalSteps={6} />,
        }}
      />

      <Stack.Screen
        name="CompleteCreate"
        component={CompleteCreateScheduleScreen}
        options={{
          headerTitle: () => <StepBar currentStep={5} totalSteps={6} />,
        }}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleWithOCRNavigator
