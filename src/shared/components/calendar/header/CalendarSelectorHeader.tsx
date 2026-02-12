import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import CalendarIcon from '../../../../assets/icons/calendar.svg'
import ArrowLeft from '../../../../assets/icons/black-arrow-l.svg'
import ArrowRight from '../../../../assets/icons/black-arrow-r.svg'
import dayjs from 'dayjs'
import GlobalText from '../../text/GlobalText'

interface CalendarHeaderProps {
  currentDate: dayjs.Dayjs
  onPrevMonth: () => void
  onNextMonth: () => void
}

const CalendarSelectorHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row rounded-radius-xl border-[0.5px] border-alpha-inverse10 px-[8px] py-[10px]">
        <CalendarIcon />
        <GlobalText className="ms-[5px] font-pretSemiBold text-heading-xxxs">
          {currentDate.format('YYYY년 MM월')}
        </GlobalText>
      </View>
      <View className="flex-row items-center gap-x-[8px]">
        <TouchableOpacity
          className="items-center justify-center rounded-radius-max border-[0.5px] border-alpha-inverse10 p-[4px]"
          onPress={onPrevMonth}
        >
          <ArrowLeft className="h-[20px] w-[20px]" />
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center rounded-radius-max border-[0.5px] border-alpha-inverse10 p-[4px]"
          onPress={onNextMonth}
        >
          <ArrowRight className="h-[20px] w-[20px]" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CalendarSelectorHeader
