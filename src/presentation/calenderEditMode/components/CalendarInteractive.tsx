/* eslint-disable react-hooks/exhaustive-deps */
// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import CalendarBase from '../../calenderType/components/calendar/personal/CalendarBase'
import dayjs from 'dayjs'
import { ShiftType } from '../../../data/model/Calendar'
import { workDaysToMap } from '../../common/utils/calendar/workDaysToMap'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'

interface CalendarInteractiveProps {
  isEditScreen: boolean
  currentDate: dayjs.Dayjs
  setCurrentDate: (date: dayjs.Dayjs) => void
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
  calendarData: Map<string, ShiftType> // 키를 string으로 변경
  setCalendarData: (data: Map<string, ShiftType>) => void // 키를 string으로 변경
}

const CalendarInteractive = ({
  isEditScreen,
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  calendarData,
  setCalendarData,
}: CalendarInteractiveProps) => {
  const year = currentDate.year()
  const month = currentDate.month() + 1

  // 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarRepository.getWorkCalendar(year, month)
        // workDaysToMap 유틸리티를 사용하여 'YYYY-MM-DD'를 키로 하는 Map을 생성
        const formattedMap = workDaysToMap(response, year, month)
        setCalendarData(formattedMap)
        console.log('근무표 조회 성공:', response)
      } catch (error) {
        console.log('근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [year, month])

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
