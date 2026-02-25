// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import TCalendarBase from './TCalendarBase'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { useShallow } from 'zustand/shallow'

interface CalendarInteractiveProps {
  currentDate: dayjs.Dayjs
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs) => void
  selectedYearMonth: { year: number; month: number }
}

const TCalendarInteractive = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  selectedYearMonth,
}: CalendarInteractiveProps) => {
  const organizationName = useScheduleInfoStore(state => state.organizationName)
  const { teamCalendarData, myTeam, fetchTeamCalendarData } =
    useTeamCalendarStore(
      useShallow(state => ({
        teamCalendarData: state.teamCalendarData,
        myTeam: state.myTeam,
        fetchTeamCalendarData: state.fetchTeamCalendarData,
      }))
    )

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 팀 근무표 조회 API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('팀 근무표 조회 request: ', {
          organizationName,
          myTeam,
          monthStartDate,
          monthEndDate,
        })
        await fetchTeamCalendarData(
          organizationName,
          monthStartDate,
          monthEndDate
        )
      } catch (error) {
        console.log('팀 근무표 수정 모드: 월별 근무표 조회 실패:', error)
      }
    }
    fetchData()
  }, [monthStartDate, monthEndDate])

  return (
    <View>
      <TCalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={setSelectedDate}
        teamCalendarData={teamCalendarData}
        myTeam={myTeam}
      />
    </View>
  )
}

export default TCalendarInteractive
