import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import TeamVersion from '../../../../assets/icons/users-profiles-01.svg'
import ArrowDown from '../../../../assets/icons/chevron-down.svg'
import CalendarYearMonthPickerModal from './CalendarYearMonthPickerModal'

dayjs.locale('ko')

interface CalendarViewerHeaderProps {
  selectedDate: Date
  onChange: (date: Date) => void
  onPressTeamIcon?: () => void
}

const CalendarViewerHeader = ({
  selectedDate,
  onChange,
  onPressTeamIcon,
}: CalendarViewerHeaderProps) => {
  const [visible, setVisible] = useState(false)

  const handleOpen = () => {
    setVisible(true)
  }

  const handleConfirm = (year: number, month: number) => {
    setVisible(false)
    onChange(new Date(year, month - 1, 1))
  }

  return (
    <View className="h-[50px] flex-row items-center justify-between ">
      <TouchableOpacity
        className="flex-row items-center gap-[10px]"
        onPress={handleOpen}
      >
        <Text className="text-text-basic heading-xs">
          {dayjs(selectedDate).format('YYYY. M. D (dd)')}
        </Text>
        <ArrowDown />
      </TouchableOpacity>

      <CalendarYearMonthPickerModal
        visible={visible}
        year={selectedDate.getFullYear()}
        month={selectedDate.getMonth() + 1}
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
      />

      <View className="flex-row items-center gap-[10px]">
        <TouchableOpacity onPress={onPressTeamIcon}>
          <TeamVersion />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CalendarViewerHeader
