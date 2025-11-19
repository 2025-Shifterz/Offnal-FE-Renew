import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import TCalendarBase from './TCalendarBase'
import dayjs from 'dayjs'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import {
  calendarRepository,
  teamCalendarRepository,
} from '../../../../infrastructure/di/Dependencies'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { WorkType } from '../../../types/Calendar'
import { TeamDateAndWorkType } from '../../../types/TeamCalendar'

// 예시 데이터
const calendarData = {
  '2025-07-15': {
    '1조': '주간',
    '2조': '야간',
    '3조': '오후',
    '4조': '휴일',
  },
  '2025-07-16': {
    '1조': '오후',
    '2조': '오후',
    '3조': '주간',
  },
  '2025-07-17': {
    '2조': '야간',
    '4조': '주간',
  },
  '2025-07-18': {
    '1조': '주간',
  },
  '2025-07-19': {
    '3조': '휴일',
    '4조': '야간',
  },
} as const

interface TCalendarViewerProps {
  onPressTeamIcon: () => void
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  onDateSelected?: (date: dayjs.Dayjs) => void
}

const TCalendarViewer = ({
  onPressTeamIcon,
  selectedDate,
  setSelectedDate,
  onDateSelected,
}: TCalendarViewerProps) => {
  const [curentDate, setCurrentDate] = useState(dayjs())

  const selectedYearMonth = useCalendarStore(state => state.selectedYearMonth)
  const latestOrganization = useCalendarStore(state => state.latestOrganization)
  const teamCalendarData = useTeamCalendarStore(state => state.teamCalendarData)
  const setTeamCalendarData = useTeamCalendarStore(
    state => state.setTeamCalendarData
  )

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 팀 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  // 벡엔드 측 API 수정 필요
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await teamCalendarRepository.getTeamCalendar(
          latestOrganization.organizationName,
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
        console.log('팀 캘린더 탭: 월별 근무표 조회 성공:', response)
        console.log('organization name:', latestOrganization.organizationName)
      } catch (error) {
        console.log('팀 캘린더 탭: 월별 근무표 조회 실패:', error)
        console.log('organization name:', latestOrganization.organizationName)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        currentDate={curentDate}
        setCurrentDate={setCurrentDate}
        // selectedDate={selectedDate}

        onDatePress={handleDatePress}
        onPressTeamIcon={onPressTeamIcon}
        teamCalendarData={teamCalendarData}
        isViewer
      />
    </View>
  )
}

export default TCalendarViewer
