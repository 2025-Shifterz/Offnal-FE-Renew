import React, { useEffect } from 'react'
import { View } from 'react-native'
import TCalendarBase from './TCalendarBase'
import dayjs from 'dayjs'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'

interface TCalendarViewerProps {
  selectedYearMonth: { year: number; month: number }

  currentDate: dayjs.Dayjs
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  onDateSelected?: (date: dayjs.Dayjs) => void
}

const TCalendarViewer = ({
  selectedYearMonth,
  currentDate,
  selectedDate,
  setSelectedDate,
  onDateSelected,
}: TCalendarViewerProps) => {
  const { organizationName } = useScheduleInfoStore()
  const { teamCalendarData, fetchTeamCalendarData, myTeam } =
    useTeamCalendarStore()

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 팀 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  // 벡엔드 측 API 수정 필요
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTeamCalendarData(
          organizationName,
          monthStartDate,
          monthEndDate
        )
      } catch (error) {
        console.log('팀 캘린더 탭: 월별 근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [organizationName, monthStartDate, monthEndDate, fetchTeamCalendarData])

  // ----------

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    console.log('selectedDate:', selectedDate)
    onDateSelected?.(date) // ✅ 날짜 선택 시 콜백 실행
  }
  return (
    <View>
      <TCalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        teamCalendarData={teamCalendarData}
        myTeam={myTeam}
      />
    </View>
  )
}

export default TCalendarViewer
