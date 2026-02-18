// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import CalendarBase from './CalendarBase'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { useShallow } from 'zustand/shallow'

interface CalendarInteractiveProps {
  currentDate: dayjs.Dayjs
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
  selectedYearMonth: { year: number; month: number }
}

const CalendarInteractive = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  selectedYearMonth,
}: CalendarInteractiveProps) => {
  const { organizationName, workGroup } = useScheduleInfoStore(
    useShallow(state => ({
      organizationName: state.organizationName,
      workGroup: state.workGroup,
    }))
  )

  const calendarData = useCalendarStore(state => state.calendarData)
  const fetchCalendarData = useCalendarStore(state => state.fetchCalendarData)

  // 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      // '2025-11-01' 형태
      const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
      const monthEndDate = dayjs(monthStartDate)
        .endOf('month')
        .format('YYYY-MM-DD')

      try {
        console.log('요청하는 근무표 조회 데이터: ', {
          organizationName,
          workGroup,
          monthStartDate,
          monthEndDate,
        })
        await fetchCalendarData(
          organizationName,
          workGroup,
          monthStartDate,
          monthEndDate
        )
      } catch (error) {
        console.log('근무표 수정 모드: 월별 근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [selectedYearMonth, organizationName, workGroup, fetchCalendarData])

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={setSelectedDate}
        calendarData={calendarData}
      />
    </View>
  )
}

export default CalendarInteractive
