// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'
import CalendarBase from '../../../shared/components/calendar/personal/CalendarBase'
import { useCalendarStore } from '../../../store/useCalendarStore'

interface CalendarInteractiveProps {
  isEditScreen: boolean
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
}

const CalendarInteractive = ({
  isEditScreen,
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
        console.log('근무표 수정 모드: 월별 근무표 조회 성공:', response)
      } catch (error) {
        console.log('근무표 수정 모드: 월별 근무표 조회 실패:', error)
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
