import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  onboardingOCRNavigation,
  OnboardingOCRStackParamList,
} from '../../../../navigation/types'
import { useWorkTime } from '../../../../shared/context/WorkTimeContext'
import CalendarEditor, {
  CalendarEditorRef,
} from '../../../../shared/components/calendar/personal/CalendarEditor'
import TCalendarEditor, {
  TCalendarEditorRef,
} from '../../../../shared/components/calendar/team/TCalendarEditor'
import TitleMessage from '../../../../shared/components/TitleMessage'
import BottomButton from '../../../../shared/components/BottomButton'
import dayjs from 'dayjs'
import CalendarEditorHeader from '../../../../shared/components/calendar/header/CalendarEditorHeader'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingOCRStackParamList,
  'InputCalendarTypeOCR'
>

const InputCalendarTypeOCRScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const { selectedScheduleScopeType, calendarName, workGroup, workTimes } =
    route.params

  const { setWorkTimes } = useWorkTime()
  const [currentDate, setCurrentDate] = useState(dayjs)

  useEffect(() => {
    if (workTimes) {
      setWorkTimes(workTimes)
    }
  }, [workTimes, setWorkTimes])

  const navigation = useNavigation<onboardingOCRNavigation>()

  // 자식의 postData 호출
  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const tCalendarEditorRef = useRef<TCalendarEditorRef>(null)

  const handleNext = () => {
    if (selectedScheduleScopeType === 'ALL') {
      if (tCalendarEditorRef.current) {
        tCalendarEditorRef.current.postData() // 팀 근무표 저장 요청
      }
    } else {
      if (calendarEditorRef.current) {
        calendarEditorRef.current.postData() // 근무표 저장 요청
      }
    }
    navigation.navigate('CompleteScheduleOCR', { selectedScheduleScopeType })
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
              organizationName={calendarName}
              workGroup={workGroup}
              workTimes={workTimes}
            />
          ) : (
            <CalendarEditor
              currentDate={currentDate}
              ref={calendarEditorRef}
              organizationName={calendarName}
              workGroup={workGroup}
              workTimes={workTimes}
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

export default InputCalendarTypeOCRScreen
