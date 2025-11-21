import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  onboardingNavigation,
  OnboardingStackParamList,
} from '../../../navigation/types'
import { useWorkTime } from '../../../shared/context/WorkTimeContext'
import TitleMessage from '../../../shared/components/TitleMessage'
import BottomButton from '../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarEditor, {
  CalendarEditorRef,
} from '../../../shared/components/calendar/personal/CalendarEditor'
import TCalendarEditor, {
  TCalendarEditorRef,
} from '../../../shared/components/calendar/team/TCalendarEditor'
import CalendarEditorHeader from '../../../shared/components/calendar/header/CalendarEditorHeader'
import dayjs from 'dayjs'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingStackParamList,
  'InputCalendarType'
>

const InputCalendarTypeScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const { selectedScheduleScopeType, organizationName, workGroup, workTimes } =
    route.params
  const [currentDate, setCurrentDate] = useState(dayjs)

  useEffect(() => {
    console.log('넘어온 근무표 기본정보 입력: ', {
      selectedScheduleScopeType,
      organizationName,
      workGroup,
      workTimes,
    })
  }, [selectedScheduleScopeType, organizationName, workGroup, workTimes])

  const { setWorkTimes } = useWorkTime()

  useEffect(() => {
    if (workTimes) {
      setWorkTimes(workTimes)
    }
  }, [workTimes, setWorkTimes])

  const navigation = useNavigation<onboardingNavigation>()

  // 자식의 postData 호출
  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const tCalendarEditorRef = useRef<TCalendarEditorRef>(null)
  const handleNext = () => {
    if (selectedScheduleScopeType === 'ALL') {
      if (tCalendarEditorRef.current) {
        console.log('팀 근무표 저장 요청 실행')
        tCalendarEditorRef.current.postData() // 팀 근무표 저장 요청
      }
    } else {
      if (calendarEditorRef.current) {
        console.log('개인 근무표 저장 요청 실행')
        calendarEditorRef.current.postData() // 근무표 저장 요청
      }
    }

    navigation.navigate('CompleteSchedule', { selectedScheduleScopeType })
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
    >
      <ScrollView className="mb-[100px] w-full flex-1">
        <TitleMessage
          title="달력에 근무 형태를 입력해주세요."
          subTitle="각 날짜에 해당하는 근무 유형을 선택해주세요."
        />
        <View className="mt-[20px] rounded-radius-xl bg-white">
          <CalendarEditorHeader
            currentDate={currentDate}
            onPrevMonth={() =>
              setCurrentDate(prev => prev.subtract(1, 'month'))
            }
            onNextMonth={() => setCurrentDate(prev => prev.add(1, 'month'))}
          />
          {selectedScheduleScopeType === 'ALL' ? (
            <TCalendarEditor
              currentDate={currentDate}
              ref={tCalendarEditorRef}
              organizationName={organizationName}
              workGroup={workGroup}
              workTimes={workTimes}
            />
          ) : (
            <CalendarEditor
              currentDate={currentDate}
              ref={calendarEditorRef}
              workTimes={workTimes}
              organizationName={organizationName}
              workGroup={workGroup}
            />
          )}
        </View>
      </ScrollView>
      <View>
        <BottomButton text="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  )
}

export default InputCalendarTypeScreen
