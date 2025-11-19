// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'
import CalendarBase from '../../../shared/components/calendar/personal/CalendarBase'
import { useCalendarStore } from '../../../store/useCalendarStore'
import { useTeamCalendarStore } from '../../../store/useTeamCalendarStore'

interface CalendarInteractiveProps {
  currentDate: dayjs.Dayjs
  setCurrentDate: (date: dayjs.Dayjs) => void
  isEditScreen: boolean
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
}

const CalendarInteractive = ({
  currentDate,
  setCurrentDate,
  isEditScreen,
  selectedDate,
  setSelectedDate,
}: CalendarInteractiveProps) => {
  const latestOrganization = useCalendarStore(state => state.latestOrganization)
  const calendarData = useCalendarStore(state => state.calendarData)
  const setCalendarData = useCalendarStore(state => state.setCalendarData)
  const selectedYearMonth = useCalendarStore(state => state.selectedYearMonth)
  const myTeam = useTeamCalendarStore(state => state.myTeam)
  // 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      // '2025-11-01' 형태
      const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
      const monthEndDate = dayjs(monthStartDate)
        .endOf('month')
        .format('YYYY-MM-DD')

      try {
        const response = await calendarRepository.getCalendar(
          latestOrganization.organizationName,
          myTeam,
          monthStartDate,
          monthEndDate
        )

        setCalendarData(response)
        console.log('myTeam:', myTeam)
        console.log('근무표 수정 모드: 월별 근무표 조회 성공:', response)
      } catch (error) {
        console.log('근무표 수정 모드: 월별 근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [
    selectedYearMonth,
    latestOrganization.organizationName,
    myTeam,
    setCalendarData,
  ])

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
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
