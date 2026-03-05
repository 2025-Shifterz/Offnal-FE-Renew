import { View } from 'react-native'
import Camera from '../../../assets/icons/camera.svg'
import CalendarYellow from '../../../assets/icons/calendar_yellow.svg'
import CalendarBlue from '../../../assets/icons/calendar_blue.svg'
import RegMethod from '../component/RegMethod'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  rootNavigation,
  RootStackParamList,
} from '../../../navigation/types/StackTypes'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/GlobalText'
import BottomButton from '../../../shared/components/BottomButton'
import { OnboardingMethod } from '../types/onboardingTypes'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import { useEffect, useLayoutEffect } from 'react'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'

const OnboardingMethodTopAppBar = ({
  enableBackButton,
  onBack,
}: {
  enableBackButton: boolean
  onBack: () => void
}) => {
  return (
    <CenterAlignedTopAppBar
      navigationIcon={
        enableBackButton ? <TopAppBarBackButton onPress={onBack} /> : null
      }
      title={null}
      applySafeArea={true}
    />
  )
}

const OnboardingMethodScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route =
    useRoute<RouteProp<RootStackParamList, 'OnboardingMethodScreen'>>()
  const { createScheduleButtonClick } = route.params

  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)
  const setOnboardingMethod = useOnboardingStore(
    state => state.setOnboardingMethod
  )

  // 초기 상태를 OCR로 설정
  useEffect(() => {
    setOnboardingMethod('OCR')
  }, [])

  // 이 함수는 클릭된 박스의 type을 받아서 상태를 업데이트.
  const handleBoxClick = (type: OnboardingMethod) => {
    setOnboardingMethod(type)
  }

  const handleNext = () => {
    switch (onboardingMethod) {
      case 'OCR':
        navigation.navigate('OnboardingSchedules', {
          screen: 'SelectScheduleScope', // 첫 화면으로 이동
        })
        break
      case 'NEW':
        navigation.navigate('OnboardingSchedules', {
          screen: 'SelectScheduleScope', // 첫 화면으로 이동
        })
        break
      case 'DIRECT':
        navigation.navigate('Tabs', { screen: 'Home' })
        break
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <OnboardingMethodTopAppBar
          enableBackButton={createScheduleButtonClick}
          onBack={navigation.goBack}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [navigation])

  return (
    <SafeAreaView
      className="h-full w-full flex-1 bg-background-gray-subtle1"
      edges={['bottom']}
    >
      <View className="mx-p-7 flex-1">
        <View className="mb-[4px]" />
        <GlobalText className="text-text-bolder heading-m">
          오프날에 오신걸 환영해요!{`\n`}근무표를 어떤 방법으로 입력할까요?
        </GlobalText>
        <GlobalText className="mb-number-9 pt-number-7 text-text-subtle label-xs">
          회사 근무표 검색 기능은 추후 추가될 예정이에요.
        </GlobalText>

        <RegMethod<OnboardingMethod>
          type="OCR"
          isSelected={onboardingMethod === 'OCR'}
          Icon={Camera}
          title="근무표 사진 찍어서 자동 등록하기"
          subtitle="AI로 근무표를 자동 등록해요"
          onPress={handleBoxClick}
        />

        <RegMethod<OnboardingMethod>
          type="NEW"
          isSelected={onboardingMethod === 'NEW'}
          Icon={CalendarYellow}
          title="근무표 새로 만들기"
          subtitle="지금 바로 직접 근무표를 만들고 시작해요"
          onPress={handleBoxClick}
        />
        {!createScheduleButtonClick && (
          <RegMethod<OnboardingMethod>
            type="DIRECT"
            isSelected={onboardingMethod === 'DIRECT'}
            Icon={CalendarBlue}
            title="근무표 없이 시작하기"
            subtitle="지금은 근무표 없이 시작하고, 나중에 등록할 수 있어요"
            onPress={handleBoxClick}
          />
        )}

        <BottomButton text="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  )
}

export default OnboardingMethodScreen
