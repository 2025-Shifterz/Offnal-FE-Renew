import { View, Text, Alert, ScrollView } from 'react-native'
import CalendarEditor, {
  CalendarEditorRef,
} from '../../../calenderType/components/calendar/personal/CalendarEditor'
import { useRef } from 'react'
import {
  onboardingNavigation,
  OnboardingStackParamList,
} from '../../../../navigation/types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { toShiftType } from '../../../../data/mappers/ShiftTypeMapper'

import {
  MonthlySchedule,
  NewCalendar,
  ShiftType,
} from '../../../../data/model/Calendar'
import TCalendarEditor from '../../../calenderType/components/calendar/team/TCalendarEditor'
import { convertOCRResultToPersonalSchduleData } from '../../mapper/calendarDataMapper'
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import BottomButton from '../../../../shared/components/BottomButton'
import { SafeAreaView } from 'react-native-safe-area-context'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingStackParamList,
  'EditScheduleOCR'
>

const EditScheduleOCRScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const navigation = useNavigation<onboardingNavigation>()
  const {
    selectedScheduleScopeType,
    calendarName,
    workGroup,
    workTimes,
    ocrResult,
    year,
    month,
  } = route.params

  const myWorkSheet = (() => {
    if (
      selectedScheduleScopeType === 'MY' &&
      ocrResult &&
      Array.isArray(ocrResult)
    ) {
      const foundSheet = ocrResult.find(([workGroupNumber]) => {
        const cleanWorkGroup = workGroup.replace('조', '')
        return workGroupNumber === cleanWorkGroup
      })
      return foundSheet
    }
    return undefined
  })()

  const handleNext = () => {
    try {
      const shiftTimesMap = new Map<
        ShiftType,
        { startTime: string; endTime: string }
      >()

      Object.entries(workTimes).forEach(([type, time]) => {
        const shiftType = toShiftType(type)
        if (shiftType) {
          shiftTimesMap.set(shiftType, time)
        }
      })

      const monthlySchedules: MonthlySchedule[] = []

      if (ocrResult && Array.isArray(ocrResult)) {
        if (selectedScheduleScopeType === 'MY') {
          if (myWorkSheet && myWorkSheet.length === 2) {
            const [, shiftsByDay]: [string, Record<string, string>] =
              myWorkSheet
            const shiftsMap = new Map<number, ShiftType>()

            Object.entries(shiftsByDay).forEach(([dayStr, ocrShiftType]) => {
              const day = parseInt(dayStr, 10)
              const shift = toShiftType(ocrShiftType)
              if (!isNaN(day) && shift) {
                shiftsMap.set(day, shift)
              }
            })

            monthlySchedules.push({
              year,
              month,
              shifts: shiftsMap,
            })
          } else {
            Alert.alert(
              '오류',
              `선택된 조 (${workGroup})의 근무표 데이터를 OCR 결과에서 찾을 수 없습니다.`
            )
            return
          }
        }
      }

      const newCalendar: NewCalendar = {
        name: calendarName,
        group: workGroup,
        shiftTimes: shiftTimesMap,
        schedules: monthlySchedules,
      }

      calendarRepository.createWorkCalendar(newCalendar)

      navigation.navigate('CompleteScheduleOCR')
    } catch (error) {
      Alert.alert(
        '오류',
        '근무표 생성 중 오류가 발생했습니다. 다시 시도해주세요.'
      )
    }
  }

  const calendarEditorRef = useRef<CalendarEditorRef>(null)
  const scheduleData = convertOCRResultToPersonalSchduleData(
    year,
    month,
    workGroup,
    ocrResult
  )

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-number-8"
    >
      <ScrollView>
        <Text className="mt-[5px] text-text-subtle heading-m">
          AI 근무표 인식이 완료되었어요
        </Text>
        <Text className="pt-number-7 text-text-subtle label-xs">
          정확히 인식되지 않은 부분을 수정해 주세요
        </Text>
        <View className="mt-[20px]">
          {selectedScheduleScopeType === 'ALL' ? (
            <TCalendarEditor
              calendarName={calendarName}
              workGroup={workGroup}
              workTimes={workTimes}
            />
          ) : (
            <CalendarEditor
              ref={calendarEditorRef}
              calendarName={calendarName}
              workGroup={workGroup}
              workTimes={workTimes}
              year={year}
              month={month}
              scheduleData={scheduleData}
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

export default EditScheduleOCRScreen
