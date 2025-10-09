 
 
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TimeFrame, { TimeFrameChildren } from '../../TimeFrame'
import CalendarEditorHeader from '../header/CalendarEditorHeader'
import CalendarViewerHeader from '../header/CalendarViewerHeader'

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
const textInformation = '#096AB3'
const textDanger = '#BD2C0F'

interface CalendarBaseProps {
  selectedDate?: dayjs.Dayjs | null
  onDatePress?: (date: dayjs.Dayjs) => void
  calendarData: Record<string, Record<string, TimeFrameChildren>>
  isViewer: boolean
  onPressTeamIcon?: () => void
  onPressEditIcon?: () => void
}

const TCalendarBase = ({
  selectedDate,
  onDatePress,
  calendarData,
  isViewer,
  onPressTeamIcon,
  onPressEditIcon,
}: CalendarBaseProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs())

  const startOfMonth = currentDate.startOf('month')
  const startDay = startOfMonth.day()
  const daysInMonth = currentDate.daysInMonth()

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'))
  }

  // 한 주 단위로 구성된 날짜 + 조 표시
  const renderWeeks = () => {
    const weeks = []
    const totalSlots = startDay + daysInMonth
    const totalRows = Math.ceil(totalSlots / 7)
    let dayCounter = 1

    for (let row = 0; row < totalRows; row++) {
      const weekDays = []

      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col

        if (index < startDay || dayCounter > daysInMonth) {
          weekDays.push(<View style={styles.dayBox} key={`empty-${index}`} />)
        } else {
          const date = startOfMonth.date(dayCounter)
          const weekDay = date.day()
          const isToday = dayjs().isSame(date, 'day')
          const isSelected = selectedDate
            ? selectedDate.isSame(date, 'day')
            : false
          const time = calendarData?.[date.format('YYYY-MM-DD')]

          let textColor = '#000'
          if (weekDay === 0) textColor = textDanger
          else if (weekDay === 6) textColor = textInformation

          weekDays.push(
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onDatePress && onDatePress(date)}
              style={styles.dayBox}
              key={`day-${dayCounter}`}
            >
              <View className="flex items-center gap-[3px]">
                <View
                  className={`h-[30px] w-[30px] items-center justify-center rounded-radius-max ${
                    isToday ? 'bg-surface-gray-subtle1' : ''
                  } ${isSelected ? 'bg-border-primary' : ''}`}
                >
                  <Text
                    className={`heading-xxxs`}
                    style={[
                      { color: textColor },
                      isSelected && { color: 'white' },
                    ]}
                  >
                    {dayCounter}
                  </Text>
                </View>
                <View className="flex h-[110px] gap-1">
                  {['1조', '2조', '3조', '4조'].map(team => {
                    const teamTime = time?.[team]
                    return teamTime ? (
                      <TimeFrame key={team} text={teamTime} />
                    ) : (
                      <View key={team} style={{ height: 23 }} />
                    )
                  })}
                </View>
              </View>
            </TouchableOpacity>
          )
          dayCounter++
        }
      }

      weeks.push(
        <View className="flex-row" key={`week-${row}`}>
          <View className="mt-8 w-[35px] flex-col items-center justify-center gap-4">
            <Text style={styles.groupText}>1조</Text>
            <Text style={styles.groupText}>2조</Text>
            <Text style={styles.groupText}>3조</Text>
            <Text style={styles.groupText}>4조</Text>
          </View>
          <View className="flex-row flex-wrap" style={{ flex: 1 }}>
            {weekDays}
          </View>
        </View>
      )
    }

    return weeks
  }

  return (
    <View className="rounded-t-radius-m2 bg-surface-white">
      {/* 헤더 */}
      {isViewer ? (
        <CalendarViewerHeader
          onPressTeamIcon={onPressTeamIcon}
          onPressEditIcon={onPressEditIcon}
          selectedDate={currentDate.toDate()}
          onChange={newDate => setCurrentDate(dayjs(newDate))}
        />
      ) : (
        <CalendarEditorHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      )}

      {/* 요일 라벨 */}
      <View className="mt-2 flex-row">
        <View className="ml-[34px] h-[30px] flex-1 flex-row items-center justify-between">
          {daysOfWeek.map((day, index) => (
            <Text
              className="text-text-disabled body-xxs"
              key={index}
              style={[
                styles.weekDayText,
                index === 0 && { color: textDanger },
                index === 6 && { color: textInformation },
              ]}
            >
              {day}
            </Text>
          ))}
        </View>
      </View>

      {/* 날짜 + 조 */}
      <View className="pb-[10px]">{renderWeeks()}</View>
    </View>
  )
}

export default TCalendarBase

const styles = StyleSheet.create({
  dayBox: {
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  groupText: {
    fontSize: 9,
    lineHeight: 12,
  },
  weekDayText: {
    fontWeight: '600',
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
})
