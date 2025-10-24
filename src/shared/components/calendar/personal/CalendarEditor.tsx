import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react'
import CalendarBase from './../personal/CalendarBase'
import dayjs from 'dayjs'
import {
  fromCodetoShiftType,
  toShiftType,
} from '../../../../data/mappers/ShiftTypeMapper'
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import { CreateCalendarRequest } from '../../../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { WorkType } from '../../../types/Calendar'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { View } from 'react-native'
import TypeSelect from './TypeSelect'

export interface CalendarEditorRef {
  postData: () => void
}

const CalendarEditor: ForwardRefRenderFunction<
  CalendarEditorRef,
  CreateCalendarRequest
> = ({ calendarName, workTimes, calendars }, ref) => {
  // stores
  const selectedDate = useCalendarStore(state => state.selectedDate)
  const setSelectedDate = useCalendarStore(state => state.setSelectedDate)
  const calendarData = useCalendarStore(state => state.calendarData)
  const updateCalendarDay = useCalendarStore(state => state.updateCalendarDay)

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
    updateCalendarDay(key, fromCodetoShiftType(type))
  }

  // 부모에서 호출할 수 있게 내보낸다.
  useImperativeHandle(ref, () => ({
    postData: async () => {
      try {
        // const calendarData: DateAndWorkTypeRecord = {}

        const organizationId = 1 // 임시 값
        const newCalendar: CreateCalendarRequest = {
          calendarName: calendarName,
          organizationId: organizationId,
          workTimes: workTimes,
          calendars: calendars,
        }
        console.log('요청하는 데이터:', newCalendar)

        // API 호출
        const res = await calendarRepository.createCalendar(
          organizationId,
          newCalendar
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
