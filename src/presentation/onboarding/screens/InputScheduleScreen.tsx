import React, { useEffect } from 'react'
import { Alert, View } from 'react-native'
import TimeInput from '../component/TimeInput'
import TeamInput from '../component/TeamInput'
import ScheduleNameInput from '../component/ScheduleNameInput'
import { useNavigation } from '@react-navigation/native'
import HeadLineText from '../../../shared/components/text/HeadLineText'
import BottomButton from '../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import goNextOnboadingScreen from '../flow/goNextOnboardingScreen'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { OnboardingRoute } from '../../../navigation/types/OnboardingRoute'
import { useShallow } from 'zustand/shallow'

const InputScheduleScreen = () => {
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()
  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)
  const {
    organizationName = '',
    setOrganizationName,
    setWorkGroup,
  } = useScheduleInfoStore(
    useShallow(state => ({
      organizationName: state.organizationName,
      setOrganizationName: state.setOrganizationName,
      setWorkGroup: state.setWorkGroup,
    }))
  )

  useEffect(() => {
    setOrganizationName('') // 초기화
  }, [])

  const handleNext = async () => {
    if (organizationName.trim() === '') {
      Alert.alert('근무표 이름을 입력해주세요.')
      return
    }

    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.InputSchedule
    )

    navigation.navigate({ name: nextStep } as OnboardingRoute)
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
    >
      <View className="w-full flex-1">
        <HeadLineText heading="근무표의 기본 정보를 입력해주세요." />

        <View className="flex gap-[26px]">
          <ScheduleNameInput
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
          />
          <TimeInput />
          <TeamInput setWorkGroup={setWorkGroup} />
        </View>

        <BottomButton text="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  )
}

export default InputScheduleScreen
