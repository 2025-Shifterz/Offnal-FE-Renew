import dayjs from 'dayjs'
import { WorkType } from '../types/Calendar'
import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface CalendarBaseProps {
  currentDate: dayjs.Dayjs
  selectedDate?: dayjs.Dayjs
  schdules: Map<string, WorkType>
  onPressDate?: (date: dayjs.Dayjs) => void
}

const BaseCalendar = ({
  currentDate,
  selectedDate,
  schdules,
  onPressDate,
}: CalendarBaseProps) => {
  const startOfMonth = currentDate.startOf('month')
  const startOfMonthByDay = startOfMonth.day()

  const daysInMonth = currentDate.daysInMonth()

  const renderDays = () => {
    const days = []

    for (let i = 0; i < startOfMonthByDay; i++) {
      days.push(<View className={dayBoxClassName} key={`empty-${i}`} />)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i)
      const weekDay = date.day()
      const isToday = dayjs().isSame(date, 'day')
      const isSelected = selectedDate ? selectedDate.isSame(date, 'day') : false

      let textColor = '#000'

      if (weekDay === 0) {
        textColor = color_text_danger
      } else if (weekDay === 6) {
        textColor = color_text_information
      }

      const key = date.format('YYYY-MM-DD')
      const time = schdules?.get(key)

      days.push(
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onPressDate && onPressDate(date)}
          className={weekDayTextClassName}
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
                className={`text-heading-xxxs text-text-danger`}
                style={[{ color: textColor }, isSelected && { color: 'white' }]}
              >
                {i}
              </Text>
            </View>
            <View className="h-[30px]">
              {time && <WorkTypeFrame work={time} />}
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return days
  }

  return <View className="rounded-t-radius-m2 bg-surface-white" />
}

interface WorkTypeFrameProps {
  work: WorkType
  onPress?: () => void
}

const WorkTypeFrame = ({ work, onPress }: WorkTypeFrameProps) => {
  const { backgroundColor, textColor } = workTypeStyleMap[work]

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex h-[23px] w-[30px] items-center justify-center ${backgroundColor}`}
    >
      <Text className={`text-heading-xxxxs font-semibold ${textColor}`}>
        {work}
      </Text>
    </TouchableOpacity>
  )
}

const workTypeStyleMap: Record<
  WorkType,
  { backgroundColor: string; textColor: string }
> = {
  주간: {
    backgroundColor: 'bg-surface-secondary-subtle',
    textColor: 'text-text-subtle',
  },
  오후: {
    backgroundColor: 'bg-surface-success-subtle',
    textColor: 'text-text-success',
  },
  야간: {
    backgroundColor: 'bg-surface-information-subtle',
    textColor: 'text-text-information',
  },
  휴일: {
    backgroundColor: '',
    textColor: 'text-text-danger',
  },
} as const
const color_text_information = '#096AB3'
const color_text_danger = '#BD2C0F'
const dayBoxClassName =
  'flex items-center justify-center my-[9px] h-[50px] w-[14.28%]'
const weekDayTextClassName = 'font-semibold text-center w-[14.28%]'
