import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScheduleRegType from '../presentation/schedule/screens/RegTypeByScheduleScreen'
import ScheduleInfoInput from '../presentation/schedule/screens/InputScheduleInfoScheduleScreen'
import CalendarType from '../presentation/calenderType/screen/CalendarType'
import CompleteCreateScheduleScreen from '../presentation/schedule/screens/CreateCompleteScheduleScreen'

import { OnboardingStackParamList } from './types'
import InfoEditScreen from '../presentation/calInfoEdit/screen/InfoEditScreen'
import StepBar from '../shared/components/StepBar'
import CustomBackButton from '../shared/components/CustomBackButton'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

// + 온보딩 화면들
const OnBoardingScheduleNavigator = () => {
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
        component={ScheduleRegType}
        options={{
          headerTitle: () => <StepBar currentStep={0} totalSteps={4} />,
        }}
      />
      <Stack.Screen
        name="ScheduleInfoInput"
        component={ScheduleInfoInput}
        options={{
          headerTitle: () => <StepBar currentStep={1} totalSteps={4} />,
        }}
      />
      <Stack.Screen
        name="CalendarType"
        component={CalendarType}
        options={{
          headerTitle: () => <StepBar currentStep={2} totalSteps={4} />,
        }}
      />
      <Stack.Screen
        name="CompleteCreate"
        component={CompleteCreateScheduleScreen}
        options={{
          headerTitle: () => <StepBar currentStep={3} totalSteps={4} />,
        }}
      />
      <Stack.Screen
        name="InfoEdit"
        options={{ title: '근무표 정보 수정' }}
        component={InfoEditScreen}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleNavigator
