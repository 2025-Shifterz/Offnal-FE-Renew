import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import TeamInput from '../components/TeamInput'
import TimeInput from '../../schedule/component/TimeInput'
import ScheduleNameInput from '../../schedule/component/ScheduleNameInput'
import { WorkTimeContext } from '../../../shared/context/WorkTimeContext'
import BottomButton from '../../../shared/components/BottomButton'

const InfoEditScreen = () => {
  const [calendarName, setCalendarName] = useState('') // 근무표 이름
  const [workGroup, setWorkGroup] = useState('1조')

  const [workTimes, setWorkTimes] = useState({
    D: { startTime: '08:00', endTime: '16:00' },
    E: { startTime: '16:00', endTime: '00:00' },
    N: { startTime: '00:00', endTime: '08:00' },
  }) // 직접 입력 시 팀 이름

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <View className="w-full flex-1">
          <View className="mt-[-70px] flex gap-[26px]">
            <ScheduleNameInput
              calendarName={calendarName}
              setCalendarName={setCalendarName}
            />
            <WorkTimeContext.Provider value={{ workTimes, setWorkTimes }}>
              <TimeInput />
            </WorkTimeContext.Provider>
            <TeamInput setWorkGroup={setWorkGroup} />
          </View>

          <BottomButton text="저장" onPress={() => {}} />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default InfoEditScreen
