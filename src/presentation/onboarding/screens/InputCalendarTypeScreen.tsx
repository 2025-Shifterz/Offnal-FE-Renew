import React, { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import HeadLineText from '../../../shared/components/text/HeadLineText'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarEditor, {
  CalendarEditorRef,
} from '../../../shared/components/calendar/personal/CalendarEditor'
import TCalendarEditor, {
  TCalendarEditorRef,
} from '../../../shared/components/calendar/team/TCalendarEditor'
import CalendarEditorHeader from '../../../shared/components/calendar/header/CalendarEditorHeader'
import dayjs from 'dayjs'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import goNextOnboadingScreen from '../flow/goNextOnboardingScreen'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { OnboardingRoute } from '../../../navigation/types/OnboardingRoute'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import GlobalText from '../../../shared/components/text/GlobalText'
import EmphasizedButton from '../../../shared/components/button/Button'

const InputCalendarTypeScreen = () => {
  const scheduleScope = useOnboardingStore(state => state.scheduleScope)
  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)

  const workGroup = useScheduleInfoStore(state => state.workGroup)
  const [currentDate, setCurrentDate] = useState(dayjs)

  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()

  // 자식의 postData 호출
  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const tCalendarEditorRef = useRef<TCalendarEditorRef>(null)
  const handleNext = async () => {
    // 입력한 데이터가 없으면 경고
    let success = false

    if (scheduleScope === 'ALL') {
      if (tCalendarEditorRef.current) {
        success = await tCalendarEditorRef.current.postData() // 팀 근무표 저장 요청
      }
    } else {
      if (calendarEditorRef.current) {
        success = await calendarEditorRef.current.postData() // 근무표 저장 요청
      }
    }

    if (!success) return // 저장 실패 시 다음 화면으로 이동하지 않음

    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.InputCalendarType
    )

    navigation.navigate({ name: nextStep } as OnboardingRoute)
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-p-7"
    >
      <ScrollView className="w-full flex-1">
        <HeadLineText
          heading="달력에 근무 형태를 입력해주세요."
          description="각 날짜에 해당하는 근무 유형을 선택해주세요."
        />
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
            <CalendarEditor currentDate={currentDate} ref={calendarEditorRef} />
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

export default InputCalendarTypeScreen
