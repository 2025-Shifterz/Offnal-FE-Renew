import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import TimeInput from '../component/TimeInput'
import TeamInput from '../component/TeamInput'
import ScheduleNameInput from '../component/ScheduleNameInput'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  onboardingNavigation,
  OnboardingStackParamList,
} from '../../../navigation/types'
import { WorkTimeContext } from '../../../shared/context/WorkTimeContext'
import TitleMessage from '../../../shared/components/TitleMessage'
import BottomButton from '../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useOnboardingStore } from '../../../store/useOnboardingState'
import goNextOnboadingScreen from '../flow/goNextOnboadingScreen'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'

const InputScheduleScreen = () => {
  const navigation = useNavigation<onboardingNavigation>()
  const { onboardingMethod } = useOnboardingStore()

  // states
  const [organizationName, setOrganizationName] = useState('') // 조직 이름
  const [workGroup, setWorkGroup] = useState('1조') // 직접 입력 시 팀 이름
  const [workTimes, setWorkTimes] = useState({
    D: { startTime: '08:00', endTime: '16:00' },
    E: { startTime: '16:00', endTime: '00:00' },
    N: { startTime: '00:00', endTime: '08:00' },
  })
  // organizationId from store
  // const organizationId = useCalendarStore(state => state.organizationId)
  //
  // console.log('organizationId in InputScheduleScreen: ', organizationId)

  const [isDirect, setIsDirect] = useState(false) // 직접 입력인지 여부

  const handleNext = async () => {
    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.InputSchedule
    )
    console.log('다음 온보딩 스텝:', nextStep)
    navigation.navigate(nextStep, {
      method: onboardingMethod,
      organizationName,
      workGroup,
      workTimes,
    })
    console.log('근무표 기본 정보 입력 params:', {
      method: onboardingMethod,
      organizationName,
      workGroup,
      workTimes,
    })
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
          <WorkTimeContext.Provider value={{ workTimes, setWorkTimes }}>
            <TimeInput />
          </WorkTimeContext.Provider>
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
