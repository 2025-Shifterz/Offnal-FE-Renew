/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import CalendarBase from './../personal/CalendarBase'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'

interface CalendarViewerProps {
  onPressTeamIcon?: () => void
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  onDateSelected?: (date: dayjs.Dayjs) => void // ✅ 콜백 추가
}

const CalendarViewer = ({
  onPressTeamIcon,
  selectedDate,
  setSelectedDate,
  onDateSelected,
}: CalendarViewerProps) => {
  const calendarData = useCalendarStore(state => state.calendarData)
  const setCalendarData = useCalendarStore(state => state.setCalendarData)
  const selectedYearMonth = useCalendarStore(state => state.selectedYearMonth)
  const latestOrganization = useCalendarStore(state => state.latestOrganization)
  const myTeam = useTeamCalendarStore(state => state.myTeam)

  const [curentDate, setCurrentDate] = useState(dayjs())

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  // TODO: 팀 근무표에서 설정한 myTeam 으로 대체해야함 !!
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarRepository.getCalendar(
          latestOrganization.organizationName,
          myTeam || latestOrganization.team, // myTeam 이 있으면 그걸로 !!
          monthStartDate,
          monthEndDate
        )
        setCalendarData(response)
        console.log('캘린더 탭: 월별 근무표 조회 성공:', response)
        console.log('organization name:', latestOrganization.organizationName)
      } catch (error) {
        console.log('캘린더 탭: 월별 근무표 조회 실패:', error)
        console.log('organization name:', latestOrganization.organizationName)
      }
    }
    fetchData()
  }, [latestOrganization, monthStartDate, monthEndDate])

  // ----------

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    console.log('selectedDate:', selectedDate)
    onDateSelected?.(date) // ✅ 날짜 선택 시 콜백 실행
  }

  return (
    <View>
      <CalendarBase
        currentDate={curentDate}
        setCurrentDate={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={calendarData}
        onPressTeamIcon={onPressTeamIcon}
        isViewer
      />
    </View>
  )
}

export default CalendarViewer
