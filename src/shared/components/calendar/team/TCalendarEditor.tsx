import React, { useState } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import TCalendarBase from './TCalendarBase'
import TeamTypeSelect from './TeamTypeSelect'
import { TimeFrameChildren } from '../TimeFrame'

interface TCalendarEditorProps {
  calendarName: string
  workGroup: string
  workTimes: {
    [key: string]: {
      startTime: string
      endTime: string
    }
  }
}

const TCalendarEditor = ({
  calendarName,
  workGroup,
  workTimes,
}: TCalendarEditorProps) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [calendarData, setCalendarData] = useState<
    Record<string, Record<string, TimeFrameChildren>>
  >({})

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 해당 조!!!에 근무 형태 추가
  const handleTypeSelect = (team: string, type: TimeFrameChildren) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    setCalendarData(prev => {
      const dayData = prev[key] ? { ...prev[key] } : {}

      if (dayData[team] === type) {
        const updatedDayData = { ...dayData }
        delete updatedDayData[team]

        return {
          ...prev,
          [key]: updatedDayData,
        }
      }

      return {
        ...prev,
        [key]: {
          ...dayData,
          [team]: type,
        },
      }
    })
  }

  return (
    <View>
      <TCalendarBase
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={calendarData}
        isViewer={false}
      />
      <TeamTypeSelect onPressSelect={handleTypeSelect} />
    </View>
  )
}

export default TCalendarEditor
