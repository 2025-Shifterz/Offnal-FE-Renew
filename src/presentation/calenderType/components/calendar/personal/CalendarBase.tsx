// 캘린더 기본 UI
import React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TimeFrame from '../../TimeFrame'
import CalendarEditorHeader from '../header/CalendarEditorHeader'
import CalendarViewerHeader from '../header/CalendarViewerHeader'
import { ShiftType } from '../../../../../data/model/Calendar'

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
const textInformation = '#096AB3'
const textDanger = '#BD2C0F'

interface CalendarBaseProps {
  selectedDate?: dayjs.Dayjs | null
  onDatePress?: (date: dayjs.Dayjs) => void
  calendarData: Map<string, ShiftType>
  isViewer: boolean
  isEditScreen?: boolean
  onPressTeamIcon?: () => void
  onPressEditIcon?: () => void
  currentDate: dayjs.Dayjs
  onChangeMonth: (newDate: dayjs.Dayjs) => void
}

const CalendarBase = ({
  selectedDate,
  onDatePress,
  calendarData,
  isViewer,
  isEditScreen,
  onPressTeamIcon,
  onPressEditIcon,
  currentDate,
  onChangeMonth,
}: CalendarBaseProps) => {
  const startOfMonth = currentDate.startOf('month') // 2025-07-01
  // const endOfMonth = currentDate.endOf('month'); // 2025-07-31
  const startDay = startOfMonth.day() // 그 달의 1일의 요일 -> 달력에서 1일은 어느 칸에 둘지
  const daysInMonth = currentDate.daysInMonth() // 그 달이 며칠까지 있는지 계산.

  const handlePrevMonth = () => {
    onChangeMonth(currentDate.subtract(1, 'month'))
  }
  const handleNextMonth = () => {
    onChangeMonth(currentDate.add(1, 'month'))
  }

  console.log('부모가 넘기는 calendarData:', calendarData)
  console.log('Map 여부:', calendarData instanceof Map)

  // 날짜 박스 렌더링 함수
  const renderDays = () => {
    const days = [] // 날짜 배열
    // 1일이 시작하기 전까지 '공백' 칸 채우기
    for (let i = 0; i < startDay; i++) {
      days.push(<View style={styles.dayBox} key={`empty-${i}`} />)
    }
    // 1일부처 마지막 날짜까지 반복해서 박스 생성
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i)
      const weekDay = date.day() // 각 날짜 (i일)의 요일
      const isToday = dayjs().isSame(date, 'day') // 오늘인지.
      const isSelected = selectedDate ? selectedDate.isSame(date, 'day') : false // 선택된 날짜인지

      let textColor = '#000'
      if (weekDay === 0) textColor = textDanger
      else if (weekDay === 6) textColor = textInformation

      const key = date.format('YYYY-MM-DD') // string 형식
      const time = calendarData?.get(key) // string 전달

      days.push(
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onDatePress && onDatePress(date)}
          style={styles.dayBox}
          key={`day-${i}`}
        >
          <View className="flex gap-[3px]">
            <View
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
                style={[{ color: textColor }, isSelected && { color: 'white' }]}
              >
                {i}
              </Text>
            </View>
            <View className="h-[30px]">
              {time && <TimeFrame text={time} />}
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return days
  }

  return (
    <View className="rounded-t-radius-xl bg-surface-white">
      {/* 헤더 */}
      {!isEditScreen &&
        (isViewer ? (
          <CalendarViewerHeader
            onPressEditIcon={onPressEditIcon}
            onPressTeamIcon={onPressTeamIcon}
            selectedDate={currentDate.toDate()}
            onChange={newDate => onChangeMonth(dayjs(newDate))}
          />
        ) : (
          <CalendarEditorHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        ))}

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
      <View className="flex-row flex-wrap pb-[10px]">{renderDays()}</View>
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
