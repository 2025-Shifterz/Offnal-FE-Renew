import React, { useState } from 'react'
import { View } from 'react-native'
import TimeInput from '../../component/TimeInput'
import TeamInput from '../../component/TeamInput'
import ScheduleNameInput from '../../component/ScheduleNameInput'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  onboardingNavigation,
  OnboardingStackParamList,
} from '../../../../navigation/types'
import { WorkTimeContext } from '../../../../shared/context/WorkTimeContext'
import TitleMessage from '../../../../shared/components/TitleMessage'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomButton from '../../../../shared/components/BottomButton'

type ScheduleInfoInputRouteProp = RouteProp<
  OnboardingStackParamList,
  'ScheduleInfoInput'
>

const InputScheduleOCRScreen = () => {
  const route = useRoute<ScheduleInfoInputRouteProp>()
  const { selectedScheduleScopeType } = route.params

  const navigation = useNavigation<onboardingNavigation>()

  // 필수 입력 값을 작성해야 넘어가도록
  const [calendarName, setCalendarName] = useState('') // 근무표 이름
  const [workGroup, setWorkGroup] = useState('1조') // 직접 입력 시 팀 이름
  const [workTimes, setWorkTimes] = useState({
    D: { startTime: '08:00', endTime: '16:00' },
    E: { startTime: '16:00', endTime: '00:00' },
    N: { startTime: '00:00', endTime: '08:00' },
  }) // 직접 입력 시 팀 이름

  const [isDirect, setIsDirect] = useState(false) // 직접 입력인지 여부

  const handleNext = () => {
    navigation.navigate('SelectMonthWithOCR', {
      selectedScheduleScopeType,
      calendarName,
      workGroup,
      workTimes,
    })
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="w-full flex-1 bg-background-gray-subtle1 px-p-7"
    >
      <View className="flex-1">
        <TitleMessage title="근무표의 기본 정보를 입력해주세요." />

        <View className="flex gap-[26px]">
          <ScheduleNameInput
            calendarName={calendarName}
            setCalendarName={setCalendarName}
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

export default InputScheduleOCRScreen
