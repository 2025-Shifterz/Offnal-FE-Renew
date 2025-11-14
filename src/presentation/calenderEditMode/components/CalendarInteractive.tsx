// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'
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
  const latestOrganization = useCalendarStore(state => state.latestOrganization)
  const calendarData = useCalendarStore(state => state.calendarData)
  const setCalendarData = useCalendarStore(state => state.setCalendarData)
  const selectedYearMonth = useCalendarStore(state => state.selectedYearMonth)

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarRepository.getCalendar(
          latestOrganization.organizationName,
          latestOrganization.team,
          monthStartDate,
          monthEndDate
        )

        setCalendarData(response)
        console.log('월별 근무표 조회 성공2:', response)
      } catch (error) {
        console.log('월별 근무표 조회 실패2:', error)
      }
    }
    fetchData()
  }, [
    monthStartDate,
    monthEndDate,
    latestOrganization.organizationName,
    latestOrganization.team,
    setCalendarData,
  ])

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
