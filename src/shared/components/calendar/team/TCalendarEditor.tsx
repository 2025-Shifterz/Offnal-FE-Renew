import React, { useState } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import TCalendarBase from './TCalendarBase'
import TeamTypeSelect from './TeamTypeSelect'
import { TimeFrameChildren } from '../TimeFrame'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { TeamDateAndWorkType } from '../../../types/TeamCalendar'

interface TCalendarEditorProps {
  workTimes: {
    [key: string]: {
      startTime: string
      endTime: string
    }
  }
  organizationName: string
  workGroup: string
}

const TCalendarEditor = ({
  organizationName,
  workGroup,
  workTimes,
}: TCalendarEditorProps) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const teamCalendarData = useTeamCalendarStore(state => state.teamCalendarData)
  const setTeamCalendarData = useTeamCalendarStore(
    state => state.setTeamCalendarData
  )
  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 해당 조!!!에 근무 형태 추가
  const handleTypeSelect = (team: string, type: TimeFrameChildren) => {
    if (!selectedDate) return

    // YYYY-MM-DD 형식으로 변환
    const date = selectedDate.format('YYYY-MM-DD')

    const flattened: TeamDateAndWorkType[] = []

    teamCalendarData.forEach(teamRecord => {
      Object.entries(teamRecord.dates).forEach(([d, work]) => {
        flattened.push({
          team: teamRecord.team,
          date: d,
          workTypeName: work.workTypeName,
          startTime: work.startTime || '',
          endTime: work.endTime || '',
        })
      })
    })

    // 현재 선택 반영
    const existingIndex = flattened.findIndex(
      w => w.team === team && w.date === date
    )

    if (existingIndex > -1) {
      // 이미 존재하는 경우: 업데이트 또는 삭제
      if (flattened[existingIndex].workTypeName === type) {
        // 같은 근무 형태 클릭 시 삭제
        flattened.splice(existingIndex, 1)
      } else {
        // 다른 근무 형태로 변경
        flattened[existingIndex].workTypeName = type
        flattened[existingIndex].startTime = workTimes[type]?.startTime || ''
        flattened[existingIndex].endTime = workTimes[type]?.endTime || ''
      }
    } else {
      // 이미 존재하지 않는 경우: 새로운 근무 형태 추가
      flattened.push({
        team,
        date,
        workTypeName: type,
        startTime: workTimes[type]?.startTime || '',
        endTime: workTimes[type]?.endTime || '',
      })
    }

    // Zustand 업데이트
    setTeamCalendarData(flattened)
  }

  return (
    <View>
      <TCalendarBase
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        teamCalendarData={teamCalendarData}
        isViewer={false}
      />
      <TeamTypeSelect onPressSelect={handleTypeSelect} />
    </View>
  )
}

export default TCalendarEditor
