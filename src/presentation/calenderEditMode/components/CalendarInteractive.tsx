/* eslint-disable react-hooks/exhaustive-deps */
// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'
// import { workDaysToMap } from '../../../shared/utils/calendar/workDaysToMap'
import CalendarBase from '../../../shared/components/calendar/personal/CalendarBase'
import { useCalendarStore } from '../../../store/useCalendarStore'

interface CalendarInteractiveProps {
  isEditScreen: boolean
  currentDate: dayjs.Dayjs
  setCurrentDate: (date: dayjs.Dayjs) => void
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
}

const CalendarInteractive = ({
  isEditScreen,
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
}: CalendarInteractiveProps) => {
  const calendarData = useCalendarStore(state => state.calendarData)
  const setCalendarData = useCalendarStore(state => state.setCalendarData)
  // TODO: currentDate를 현재 달 대신에 선택된 달로 바꿔야 함!!!
  const currentStartDate = useCalendarStore(
    state => state.currentYearMonth.currentStartDate
  )
  const currentEndDate = useCalendarStore(
    state => state.currentYearMonth.currentEndDate
  )
  const organizationId = 1 // 임시 조직 ID
  // 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarRepository.getCalendar(
          organizationId,
          currentStartDate,
          currentEndDate
        )
        setCalendarData(response)
        console.log('근무표 조회 성공:', response)
      } catch (error) {
        console.log('근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [currentStartDate, currentEndDate])

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        onChangeMonth={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={setSelectedDate}
        calendarData={calendarData}
        isViewer={false}
        isEditScreen={isEditScreen}
      />
    </View>
  )
}

export default CalendarInteractive
