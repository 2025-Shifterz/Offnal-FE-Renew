// 근무표 조회 & 저장 동시에 되는 캘린더
import React, { useEffect } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'

import { teamCalendarRepository } from '../../../../infrastructure/di/Dependencies'
import TCalendarBase from './TCalendarBase'
import { TeamDateAndWorkType } from '../../../types/TeamCalendar'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'

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
  const { organizationName } = useScheduleInfoStore()
  const teamCalendarData = useTeamCalendarStore(state => state.teamCalendarData)
  const setTeamCalendarData = useTeamCalendarStore(
    state => state.setTeamCalendarData
  )
  const myTeam = useTeamCalendarStore(state => state.myTeam)
  // 근무표 조회 API
  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 팀 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('팀 근무표 조회 request: ', {
          organizationName,
          myTeam,
          monthStartDate,
          monthEndDate,
        })
        const response = await teamCalendarRepository.getTeamCalendar(
          organizationName,
          monthStartDate,
          monthEndDate
        )
        // 서버 workType → 내부 WorkType 필드에 맞게 매핑 필요하면 fromShiftType 사용
        const flattened: (TeamDateAndWorkType & { team: string })[] =
          response.teams.flatMap(teamRecord =>
            teamRecord.workInstances.map(wi => ({
              team: teamRecord.team,
              date: wi.date,
              workTypeName: wi.workTypeName,
              startTime: wi.startTime,
              endTime: wi.endTime,
            }))
          )

        setTeamCalendarData(flattened)
        console.log('팀 근무표 수정 모드: 월별 근무표 조회 성공:', response)
        console.log('organization name:', organizationName)
      } catch (error) {
        console.log('팀 근무표 수정 모드: 월별 근무표 조회 실패:', error)
        console.log('organization name:', organizationName)
      }
    }
    fetchData()
  }, [
    organizationName,
    monthStartDate,
    monthEndDate,
    setTeamCalendarData,
    myTeam,
  ])

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
