import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import ArrowLeft from '../../../../../assets/icons/arrow-l-d.svg'
import ArrowRight from '../../../../../assets/icons/arrow-r-d.svg'
import dayjs from 'dayjs'

interface CalendarHeaderProps {
  currentDate: dayjs.Dayjs
  onPrevMonth: () => void
  onNextMonth: () => void
}

const CalendarEditorHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <View className="px-p-5">
      <View className="flex-row justify-between py-p-4">
        <TouchableOpacity onPress={onPrevMonth}>
          <ArrowLeft />
        </TouchableOpacity>
        <Text className="text-text-basic heading-xs">
          {currentDate.format('YYYY년 MM월')}
        </Text>
        <TouchableOpacity onPress={onNextMonth}>
          <ArrowRight />
        </TouchableOpacity>
      </View>
      <View className="h-[0.5px] w-full bg-divider-gray-light">{}</View>
    </View>
  )
}

export default CalendarEditorHeader
