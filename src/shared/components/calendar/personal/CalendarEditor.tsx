import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import CalendarBase from './../personal/CalendarBase'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import { CreateCalendarRequest } from '../../../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { WorkType } from '../../../types/Calendar'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { Alert, View } from 'react-native'
import TypeSelect from './TypeSelect'
import { fromShiftType } from '../../../../data/mappers/ShiftTypeMapper'
import { convertEndTimeToDuration } from '../../../utils/calendar/convertDuration'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { useOnboardingStore } from '../../../../store/useOnboardingStore'

export interface CalendarEditorRef {
  postData: () => Promise<boolean>
}

const CalendarEditor: ForwardRefRenderFunction<
  CalendarEditorRef,
  {
    currentDate: dayjs.Dayjs
  }
> = ({ currentDate }, ref) => {
  // stores
  const {
    calendarData,
    newCalendarData,
    setSelectedDate,
    selectedDate,
    clearNewCalendarData,
    updateNewCalendarDay,
    fetchCalendarData,
  } = useCalendarStore()

  const { onboardingMethod } = useOnboardingStore()
  const { workTimes, workGroup, organizationName } = useScheduleInfoStore()

  // 편집 모드에서는 newCalendarData 사용
  let newCalendars: CreateCalendarRequest['calendars'] = []

  const startDate = `${currentDate.year()}-${String(currentDate.month() + 1).padStart(2, '0')}-01`
  const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')
  // 처음에 기존 값 조회//
  useEffect(() => {
    if (onboardingMethod === 'EXISTING_OCR') {
      // 기존 근무표가 있는 경우, 기존 근무표로 초기화
      async function fetchData() {
        await fetchCalendarData(organizationName, workGroup, startDate, endDate)
      }
      fetchData()
    } else {
      clearNewCalendarData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 근무 형태 추가
  const handleTypeSelect = (type: WorkType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    // 상태 업데이트
    updateNewCalendarDay(key, type)
  }

  const [convertedWorkTimes, setConvertedWorkTimes] = useState({
    D: { startTime: '08:00', duration: 'PT8H' },
    E: { startTime: '16:00', duration: 'PT8H' },
    N: { startTime: '00:00', duration: 'PT8H' },
  })

  // workTimes 에서 endTime -> duration 변환
  useEffect(() => {
    if (!workTimes) return
    const converted = convertEndTimeToDuration(workTimes)
    setConvertedWorkTimes(converted)
  }, [workTimes])

  // 기존 + 새로 편집한 데이터 합치기
  const allCalendarData = { ...calendarData, ...newCalendarData }

  // 부모에서 호출할 수 있는 함수 정의
  useImperativeHandle(ref, () => ({
    postData: async () => {
      // 입력 데이터 검증
      const hasAnyWorkData = Object.keys(allCalendarData).length > 0

      if (!hasAnyWorkData) {
        Alert.alert('알림', '근무 형태를 하나 이상 입력해주세요.')
        return false
      }
      try {
        // 새 캘린더 데이터 생성
        const shifts: Record<string, string> = {}
        Object.entries(allCalendarData).forEach(([date, value]) => {
          shifts[date] = fromShiftType(value.workTypeName)
        })

        newCalendars = [
          {
            organizationName,
            team: workGroup,
            shifts,
          },
        ]
        console.log('생성된 새 calendars 데이터:', newCalendars)

        // TODO: 팀에서 설정한 myTeam 정보도 포함시키기
        // 팀에서 저장하면 내가 속한 조로 다시 개인 근무표를 조회해야함!!
        const newCalendarRequest: CreateCalendarRequest = {
          myTeam: workGroup,
          workTimes: convertedWorkTimes,
          calendars: newCalendars,
        }
        console.log('요청하는 근무표 등록 데이터:', newCalendarRequest)

        // API 호출
        if (onboardingMethod === 'EXISTING_OCR') {
          await calendarRepository.updateCalendar(organizationName, workGroup, {
            shifts,
          })
        } else {
          await calendarRepository.createCalendar(newCalendarRequest)
          Alert.alert('근무표 저장 성공')
        }

        return true
      } catch (error) {
        console.error('근무표 저장 실패:', error)
        return false
      }
    },
  }))

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={allCalendarData}
      />
      <TypeSelect onPress={handleTypeSelect} />
    </View>
  )
}

export default forwardRef(CalendarEditor)
