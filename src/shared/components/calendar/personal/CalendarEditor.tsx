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
import { View } from 'react-native'
import TypeSelect from './TypeSelect'
import { fromShiftType } from '../../../../data/mappers/ShiftTypeMapper'

export interface CalendarEditorRef {
  postData: () => void
}

const CalendarEditor: ForwardRefRenderFunction<
  CalendarEditorRef,
  CreateCalendarRequest
> = ({ calendarName, workTimes }, ref) => {
  // stores
  const selectedDate = useCalendarStore(state => state.selectedDate)
  const setSelectedDate = useCalendarStore(state => state.setSelectedDate)
  const calendarData = useCalendarStore(state => state.calendarData)
  const clearCalendarData = useCalendarStore(state => state.clearCalendarData)
  const updateCalendarDay = useCalendarStore(state => state.updateCalendarDay)

  // 처음에는 초기화
  useEffect(() => {
    clearCalendarData()
  }, [clearCalendarData])

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    console.log('선택된 날짜:', date.format('YYYY-MM-DD'))
  }

  // 근무 형태 추가
  const handleTypeSelect = (type: WorkType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    // 상태 업데이트
    updateCalendarDay(key, type)
  }

  // 저장된 calendarData에 어떤 년/월이 저장되어 있는지 확인
  const storedMonths = Array.from(
    new Set( // 중복 제거
      Object.keys(calendarData).map(dateStr => dayjs(dateStr).format('YYYY-MM'))
    )
  )
  console.log('저장된 달력 데이터의 년-월:', storedMonths)

  // 새 캘린더 데이터 생성 (calendars의 월별 목록)
  const newCalendars = storedMonths.map(monthStr => {
    // monthStr: '2025-10'
    const startDate = dayjs(monthStr + '-01').format('YYYY-MM-DD')
    const endDate = dayjs(monthStr + '-01')
      .endOf('month')
      .format('YYYY-MM-DD')

    const shifts: Record<string, string> = {}

    Object.entries(calendarData).forEach(([date, value]) => {
      if (
        dayjs(date).isSameOrAfter(startDate) &&
        dayjs(date).isSameOrBefore(endDate)
      ) {
        shifts[date] = fromShiftType(value.workTypeName) // 문자열로 추출
      }
    })

    return {
      startDate,
      endDate,
      shifts,
    }
  })

  console.log('생성된 새 calendars 데이터:', newCalendars)

  // 부모에서 호출할 수 있는 함수 정의
  useImperativeHandle(ref, () => ({
    postData: async () => {
      try {
        const organizationId = 1 // 임시 값
        const newCalendarRequest: CreateCalendarRequest = {
          calendarName: calendarName,
          organizationId: organizationId,
          workTimes: workTimes,
          calendars: newCalendars,
        }
        console.log('요청하는 데이터:', newCalendarRequest)

        // API 호출
        const res = await calendarRepository.createCalendar(
          organizationId,
          newCalendarRequest
        )
        console.log('근무표 저장 성공', res)
      } catch (error) {
        console.error('근무표 저장 실패:', error)
        throw error
      }
    },
  }))
  const [currentDate, setCurrentDate] = useState(dayjs()) // 달력의 현재 표시되는 달

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        onChangeMonth={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={calendarData}
        isViewer={false}
      />
      <TypeSelect onPress={handleTypeSelect} />
    </View>
  )
}

export default forwardRef(CalendarEditor)
