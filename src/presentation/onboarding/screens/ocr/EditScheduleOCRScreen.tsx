import { View, Text, ScrollView, InteractionManager } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { OnboardingStackParamList } from '../../../../navigation/types/StackTypes'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  convertOCRResultToPersonalSchduleData,
  convertOCRResultToTeamScheduleData,
} from '../../mapper/calendarDataMapper'
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
import { OnboardingStep } from '../../types/onboardingTypes'
import goNextOnboadingScreen from '../../flow/goNextOnboardingScreen'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { OnboardingRoute } from '../../../../navigation/types/OnboardingRoute'
import GlobalText from '../../../../shared/components/text/GlobalText'
import EmphasizedButton from '../../../../shared/components/button/Button'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingStackParamList,
  'EditScheduleOCR'
>

const EditScheduleOCRScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()
  const { ocrResult, year, month } = route.params

  const [currentDate, setCurrentDate] = useState(() =>
    dayjs()
      .year(year)
      .month(month - 1)
      .date(1)
  )
  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const tCalendarEditorRef = useRef<TCalendarEditorRef>(null)

  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)
  const scheduleScope = useOnboardingStore(state => state.scheduleScope)
  const workGroup = useScheduleInfoStore(state => state.workGroup)

  const setNewCalendarData = useCalendarStore(state => state.setNewCalendarData)
  const setNewTeamCalendarData = useTeamCalendarStore(
    state => state.setNewTeamCalendarData
  )

  const isProcessedRef = useRef(false)

  // OCR 데이터를 스토어에 주입
  useEffect(() => {
    if (isProcessedRef.current) return

    const task = InteractionManager.runAfterInteractions(() => {
      isProcessedRef.current = true

      switch (scheduleScope) {
        case 'MY': {
          const scheduleData = convertOCRResultToPersonalSchduleData(
            year,
            month,
            workGroup,
            ocrResult
          )

          const calendarRecord: Record<
            string,
            { workTypeName: string; startTime?: string; endTime?: string }
          > = {}

          scheduleData.forEach((workType, dateString) => {
            calendarRecord[dateString] = { workTypeName: workType }
          })

          setNewCalendarData(calendarRecord)
          break
        }

        case 'ALL': {
          const teamScheduleData = convertOCRResultToTeamScheduleData(
            year,
            month,
            ocrResult
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

          setNewTeamCalendarData(formattedData)
          break
        }
      }
    })

    return () => task.cancel()
    // OCR 결과는 첫 진입 시 한 번만 주입한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      className="flex-1 bg-background-gray-subtle1 px-p-7"
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
        <EmphasizedButton
          content={
            <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
              다음
            </GlobalText>
          }
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  )
}

export default EditScheduleOCRScreen
