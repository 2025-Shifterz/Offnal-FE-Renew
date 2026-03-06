import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { OnboardingStackParamList } from './types/StackTypes'
import SelectScheduleScope from '../presentation/onboarding/screens/SelectScheduleScopeScreen'
import CompleteScheduleScreen from '../presentation/onboarding/screens/CompleteScheduleScreen'
import InputScheduleScreen from '../presentation/onboarding/screens/InputScheduleScreen'
import InputCalendarTypeScreen from '../presentation/onboarding/screens/InputCalendarTypeScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import { ParamListBase } from '@react-navigation/routers'
import TopAppBarBackButton from '../shared/components/button/TopAppBarBackButton'
import EditScheduleOCRScreen from '../presentation/onboarding/screens/ocr/EditScheduleOCRScreen'
import SelectPhotoOCRScreen from '../presentation/onboarding/screens/ocr/SelectPhotoOCRScreen'
import SelectMonthOCRScreen from '../presentation/onboarding/screens/ocr/SelectMonthOCRScreen'
import {
  OnboardingMethod,
  OnboardingStep,
} from '../presentation/onboarding/types/onboardingTypes'
import { goNextOnboardingHeader } from '../presentation/onboarding/flow/goNextOnboardingHeader'
import { useOnboardingStore } from '../store/useOnboardingStore'
import ProgressIndicatorHeader from '../shared/components/progress/ProgressIndicatorHeader'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

const OnboardingHeader = ({
  navigation,
  method,
  step,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>
  method: OnboardingMethod
  step: OnboardingStep
}) => {
  const stepInfo = goNextOnboardingHeader(method, step)
  if (!stepInfo) return null
  return (
    <CenterAlignedTopAppBar
      navigationIcon={
        <TopAppBarBackButton onPress={() => navigation.goBack()} />
      }
      title={
        <ProgressIndicatorHeader
          currentProgress={stepInfo.currentStep}
          totalProgress={stepInfo.totalSteps}
        />
      }
      applySafeArea={true}
    />
  )
}

// + 온보딩 화면들
const OnBoardingScheduleNavigator = () => {
  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        const step = route.name as OnboardingStep
        return {
          header: () => (
            <OnboardingHeader
              navigation={navigation}
              method={onboardingMethod}
              step={step}
            />
          ),
          headerShadowVisible: false,
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
