// 캘린더 기본 UI
import React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TimeFrame from '../TimeFrame'
import { DateAndWorkTypeRecord } from '../../../types/Calendar'

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
const textInformation = '#096AB3'
const textDanger = '#BD2C0F'

interface CalendarBaseProps {
  selectedDate: dayjs.Dayjs | null
  onDatePress: (date: dayjs.Dayjs) => void
  calendarData: DateAndWorkTypeRecord
  currentDate: dayjs.Dayjs
}

const CalendarBase = ({
  selectedDate,
  onDatePress,
  calendarData,
  currentDate,
}: CalendarBaseProps) => {
  const startOfMonth = currentDate.startOf('month') // 2025-07-01
  const startDay = startOfMonth.day() // 그 달의 1일의 요일 -> 달력에서 1일은 어느 칸에 둘지
  const daysInMonth = currentDate.daysInMonth() // 그 달이 며칠까지 있는지 계산.

  // 한 주 단위로 구성된 날짜 표시
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

          let textColor = '#000'
          if (weekDay === 0) textColor = textDanger
          else if (weekDay === 6) textColor = textInformation

          const key = date.format('YYYY-MM-DD')
          const time = calendarData?.[key]?.workTypeName

          weekDays.push(
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onDatePress && onDatePress(date)}
              style={styles.dayBox}
              key={`day-${dayCounter}`}
            >
              <View className="flex gap-[3px]">
                <View
                  style={{ overflow: 'hidden' }}
                  className={`h-[30px] w-[30px] items-center justify-center rounded-radius-max ${
                    isSelected
                      ? 'bg-border-primary'
                      : isToday
                        ? 'bg-surface-gray-subtle1'
                        : ''
                  } `}
                >
                  <Text
                    className={`text-text-danger heading-xxxs`}
                    style={[
                      { color: textColor },
                      isSelected && { color: 'white' },
                    ]}
                  >
                    {dayCounter}
                  </Text>
                </View>
                <View className="h-[30px]">
                  {time && <TimeFrame text={time} />}
                </View>
              </View>
            </TouchableOpacity>
          )
          dayCounter++
        }
      }

      weeks.push(
        <View className="flex-row" key={`week-${row}`}>
          {weekDays}
        </View>
      )
    }
    return weeks
  }

  return (
    <View
      className="rounded-t-radius-xl  bg-surface-white"
      style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'white' }}
    >
      {/* 일 월 화 수 .. */}
      <View className="mt-2 h-[30px] flex-row items-center justify-between">
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

      {/* 1, 2, 3 ... */}
      <View className="pb-[10px]">{renderWeeks()}</View>
    </View>
  )
}

export default CalendarBase

const styles = StyleSheet.create({
  dayBox: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginVertical: 9,
    width: `${100 / 7}%`,
  },
  weekDayText: {
    fontWeight: '600',
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
})
