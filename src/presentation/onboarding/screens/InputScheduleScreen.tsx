import React, { useState } from 'react'
import { View } from 'react-native'
import TimeInput from '../component/TimeInput'
import TeamInput from '../component/TeamInput'
import ScheduleNameInput from '../component/ScheduleNameInput'
import { useNavigation } from '@react-navigation/native'
import { onboardingNavigation } from '../../../navigation/types'
import TitleMessage from '../../../shared/components/TitleMessage'
import BottomButton from '../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import goNextOnboadingScreen from '../flow/goNextOnboadingScreen'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'

const InputScheduleScreen = () => {
  const navigation = useNavigation<onboardingNavigation>()
  const { onboardingMethod } = useOnboardingStore()
  const {
    organizationName,
    workGroup,
    workTimes,
    setOrganizationName,
    setWorkGroup,
  } = useScheduleInfoStore()

  const [isDirect, setIsDirect] = useState(false) // 직접 입력인지 여부

  const handleNext = async () => {
    console.log('InputScheduleScreen 상태:', {
      organizationName,
      workGroup,
      workTimes,
    })
    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.InputSchedule
    )
    console.log('다음 온보딩 스텝:', nextStep)
    navigation.navigate(nextStep)
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
    >
      <View className="w-full flex-1">
        <TitleMessage title="근무표의 기본 정보를 입력해주세요." />

        <View className="flex gap-[26px]">
          <ScheduleNameInput
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
          />
          <TimeInput />
          <TeamInput
            workGroup={workGroup}
            setWorkGroup={setWorkGroup}
            isDirect={isDirect}
            setIsDirect={setIsDirect}
          />
        </View>

        <BottomButton text="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  )
}

export default InputScheduleScreen
