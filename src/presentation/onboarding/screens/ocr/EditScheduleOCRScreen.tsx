import { View, Text, ScrollView, InteractionManager } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { OnboardingStackParamList } from '../../../../navigation/types/StackTypes'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  convertOCRResultToPersonalSchduleData,
  convertOCRResultToTeamScheduleData,
} from '../../mapper/calendarDataMapper'
import BottomButton from '../../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarEditor, {
  CalendarEditorRef,
} from '../../../../shared/components/calendar/personal/CalendarEditor'
import TCalendarEditor, {
  TCalendarEditorRef,
} from '../../../../shared/components/calendar/team/TCalendarEditor'
import dayjs from 'dayjs'
import CalendarEditorHeader from '../../../../shared/components/calendar/header/CalendarEditorHeader'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { useOnboardingStore } from '../../../../store/useOnboardingStore'
import { OnboardingStep } from '../../../../shared/types/OnboardingStep'
import goNextOnboadingScreen from '../../flow/goNextOnboardingScreen'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { OnboardingRoute } from '../../../../navigation/types/OnboardingRoute'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingStackParamList,
  'EditScheduleOCR'
>

const EditScheduleOCRScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()
  const { onboardingMethod, scheduleScope } = useOnboardingStore()
  const { ocrResult, year, month } = route.params
  const { workGroup } = useScheduleInfoStore()

  const [currentDate, setCurrentDate] = useState(dayjs)
  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const tCalendarEditorRef = useRef<TCalendarEditorRef>(null)

  // Stores
  const setNewCalendarData = useCalendarStore(state => state.setNewCalendarData)
  const setTeamCalendarData = useTeamCalendarStore(
    state => state.setTeamCalendarData
  )

  const isProcessedRef = useRef(false)

  // OCR 데이터를 스토어에 주입
  useEffect(() => {
    if (isProcessedRef.current) return

    const task = InteractionManager.runAfterInteractions(() => {
      isProcessedRef.current = true

      if (scheduleScope === 'MY') {
        const scheduleData = convertOCRResultToPersonalSchduleData(
          year,
          month,
          workGroup,
          ocrResult as [string, Record<string, string>][]
        )

        const calendarRecord: Record<
          string,
          { workTypeName: string; startTime?: string; endTime?: string }
        > = {}

        scheduleData.forEach((workType, dateString) => {
          calendarRecord[dateString] = { workTypeName: workType }
        })

        setNewCalendarData(calendarRecord)
      } else if (scheduleScope === 'ALL') {
        const teamScheduleData = convertOCRResultToTeamScheduleData(
          year,
          month,
          ocrResult as [string, Record<string, string>][]
        )

        const formattedData = teamScheduleData.map(
          ({ team, date, workType }) => ({
            team,
            date,
            workTypeName: workType,
            startTime: '',
            endTime: '',
          })
        )

        setTeamCalendarData(formattedData)
      }
    })

    return () => task.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const initialDate = dayjs()
      .year(year)
      .month(month - 1)
      .date(1)
    setCurrentDate(initialDate)
  }, [year, month])

  const handleNext = () => {
    if (scheduleScope === 'ALL') {
      if (tCalendarEditorRef.current) {
        tCalendarEditorRef.current.postData()
      }
    } else {
      if (calendarEditorRef.current) {
        calendarEditorRef.current.postData()
      }
    }
    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.EditScheduleOCR
    )
    navigation.navigate({ name: nextStep } as OnboardingRoute)
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        className="mb-[100px] w-full flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="mt-[5px] text-text-subtle heading-m">
          AI 근무표 인식이 완료되었어요
        </Text>
        <Text className="pt-number-7 text-text-subtle label-xs">
          정확히 인식되지 않은 부분을 수정해 주세요
        </Text>
        <View className="mt-[20px] rounded-radius-xl bg-white">
          <CalendarEditorHeader
            currentDate={currentDate}
            onPrevMonth={() =>
              setCurrentDate(prev => prev.subtract(1, 'month'))
            }
            onNextMonth={() => setCurrentDate(prev => prev.add(1, 'month'))}
          />
          {scheduleScope === 'ALL' ? (
            <TCalendarEditor
              myTeam={workGroup}
              currentDate={currentDate}
              ref={tCalendarEditorRef}
            />
          ) : (
            <CalendarEditor ref={calendarEditorRef} currentDate={currentDate} />
          )}
        </View>
      </ScrollView>

      <View>
        <BottomButton text="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  )
}

export default EditScheduleOCRScreen
