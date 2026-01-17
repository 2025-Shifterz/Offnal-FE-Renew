import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { OnboardingStackParamList } from './types'
import SelectScheduleScope from '../presentation/schedule/screens/SelectScheduleScopeScreen'
import StepBar from '../shared/components/StepBar'
import CompleteScheduleScreen from '../presentation/schedule/screens/CompleteScheduleScreen'
import InputScheduleScreen from '../presentation/schedule/screens/InputScheduleScreen'
import InputCalendarTypeScreen from '../presentation/schedule/screens/InputCalendarTypeScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import { ParamListBase } from '@react-navigation/routers'
import TopAppBarBackButton from '../shared/components/button/TopAppBarBackButton'
import EditScheduleOCRScreen from '../presentation/schedule/screens/ocr/EditScheduleOCRScreen'
import SelectPhotoOCRScreen from '../presentation/schedule/screens/ocr/SelectPhotoOCRScreen'
import SelectMonthOCRScreen from '../presentation/schedule/screens/ocr/SelectMonthOCRScreen'
import { OnboardingStep } from '../shared/types/OnboardingStep'
import { OnboardingMethod } from '../shared/types/OnboardingMethod'
import { goNextOnboadingHeader } from '../presentation/schedule/flow/goNextOnboardingHeader'
import { useOnboardingStore } from '../store/useOnboardingStore'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

const OnBoardingHeader = ({
  navigation,
  method,
  step,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>
  method: OnboardingMethod
  step: OnboardingStep
}) => {
  const stepInfo = goNextOnboadingHeader(method, step)
  if (!stepInfo) return null
  return (
    <CenterAlignedTopAppBar
      navigationIcon={
        <TopAppBarBackButton onPress={() => navigation.goBack()} />
      }
      title={
        <StepBar
          currentStep={stepInfo.currentStep}
          totalSteps={stepInfo.totalSteps}
        />
      }
      applySafeArea={true}
    />
  )
}

// + 온보딩 화면들
const OnBoardingScheduleNavigator = () => {
  const { onboardingMethod } = useOnboardingStore()
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        const step = route.name as OnboardingStep
        return {
          header: () => (
            <OnBoardingHeader
              navigation={navigation}
              method={onboardingMethod}
              step={step}
            />
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F4F5F6' },
        }
      }}
    >
      <Stack.Screen
        // 근무표 범위 선택 - 전체 / 개인
        name="SelectScheduleScope"
        component={SelectScheduleScope}
      />
      <Stack.Screen
        // 근무표 기본 정보 입력
        name="InputSchedule"
        component={InputScheduleScreen}
      />

      {/* OCR 화면 -- */}
      <Stack.Screen name="SelectMonthOCR" component={SelectMonthOCRScreen} />
      <Stack.Screen name="SelectPhotoOCR" component={SelectPhotoOCRScreen} />
      <Stack.Screen name="EditScheduleOCR" component={EditScheduleOCRScreen} />
      {/* -- */}

      <Stack.Screen
        // 달력에 근무 형태 입력
        name="InputCalendarType"
        component={InputCalendarTypeScreen}
      />
      <Stack.Screen
        name="CompleteSchedule"
        component={CompleteScheduleScreen}
      />
    </Stack.Navigator>
  )
}

export default OnBoardingScheduleNavigator
