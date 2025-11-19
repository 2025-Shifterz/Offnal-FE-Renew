// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'

import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import TCalendarBase from './TCalendarBase'

interface CalendarInteractiveProps {
  currentDate: dayjs.Dayjs
  setCurrentDate: (date: dayjs.Dayjs) => void
  isEditScreen: boolean
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
}

const TCalendarInteractive = ({
  currentDate,
  setCurrentDate,
  isEditScreen,
  selectedDate,
  setSelectedDate,
}: CalendarInteractiveProps) => {
  const latestOrganization = useCalendarStore(state => state.latestOrganization)
  const teamCalendarData = useTeamCalendarStore(state => state.teamCalendarData)
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
      <TCalendarBase
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={setSelectedDate}
        teamCalendarData={teamCalendarData}
        isViewer={false}
        isEditScreen={isEditScreen}
      />
    </View>
  )
}

export default TCalendarInteractive
