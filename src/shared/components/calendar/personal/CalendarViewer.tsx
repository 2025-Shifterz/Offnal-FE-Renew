import React, { useCallback } from 'react'
import CalendarBase from './../personal/CalendarBase'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { teamCalendarRepository } from '../../../../infrastructure/di/Dependencies'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { useFocusEffect } from '@react-navigation/native'

interface CalendarViewerProps {
  selectedYearMonth: { year: number; month: number }
  currentDate: dayjs.Dayjs
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  onDateSelected?: (date: dayjs.Dayjs) => void // ✅ 콜백 추가
}

const CalendarViewer = ({
  selectedYearMonth,
  currentDate,
  selectedDate,
  setSelectedDate,
  onDateSelected,
}: CalendarViewerProps) => {
  const calendarData = useCalendarStore(state => state.calendarData)
  const fetchCalendarData = useCalendarStore(state => state.fetchCalendarData)

  const { organizationName, workGroup } = useScheduleInfoStore()
  const setMyTeam = useTeamCalendarStore(state => state.setMyTeam)

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // 팀 캘린더 조회 -> myTeam 조회
          const responseTeam = await teamCalendarRepository.getTeamCalendar(
            organizationName,
            monthStartDate,
            monthEndDate
          )
          setMyTeam(responseTeam.myTeam) // myTeam 정보 저장

          // 개인 캘린더 조회
          const response = await fetchCalendarData(
            organizationName,
            responseTeam.myTeam || workGroup, // myTeam 이 있으면 그걸로 !!
            monthStartDate,
            monthEndDate
          )
          console.log('캘린더 탭: 월별 근무표 조회 성공:', response)
        } catch (error) {
          console.log('캘린더 탭: 월별 근무표 조회 실패:', error)
        }
      }
      // organizationName 이 아직 셋팅되지 않은 경우 호출을 막음
      if (organizationName === '') return
      fetchData()
    }, [organizationName, monthStartDate, monthEndDate])
  )

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    console.log('selectedDate:', selectedDate)
    onDateSelected?.(date) // ✅ 날짜 선택 시 콜백 실행
  }

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={calendarData}
      />
    </View>
  )
}

export default CalendarViewer
