import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import CalendarIcon from '../../../assets/icons/calendar.svg'
import ArrowLeft from '../../../assets/icons/black-arrow-l.svg'
import ArrowRight from '../../../assets/icons/black-arrow-r.svg'

import dayjs, { Dayjs } from 'dayjs'
import GlobalText from '../../../shared/components/GlobalText'

const arrowStyle =
  'size-[24px] items-center justify-center rounded-radius-max bg-surface-white'

interface DayBoxHeaderProps {
  currentDate: Dayjs
  setCurrentDate: (date: Dayjs) => void
}

const DayBoxHeader = ({ currentDate, setCurrentDate }: DayBoxHeaderProps) => {
  const isToday = currentDate.isSame(dayjs(), 'day')
  const handlePrevDate = () => {
    setCurrentDate((prev: Dayjs) => prev.subtract(1, 'day'))
  }

  const handleNextDate = () => {
    setCurrentDate((prev: Dayjs) => prev.add(1, 'day'))
  }

  return (
    <View className="flex-row items-center justify-between bg-surface-primary-subtle px-p-6 py-p-3">
      <TouchableOpacity onPress={handlePrevDate} className={arrowStyle}>
        <ArrowLeft />
      </TouchableOpacity>
      <View className="h-[36px] flex-row items-center justify-center gap-[5px] rounded-radius-max bg-surface-white px-p-4">
        <CalendarIcon />
        <GlobalText className="text-text-subtle heading-xxxs">
          {isToday ? '오늘' : currentDate.format('YYYY년 M월 D일 (dd)')}
        </GlobalText>
      </View>
      <View className="w-[24px]">
        {!isToday && (
          <TouchableOpacity onPress={handleNextDate} className={arrowStyle}>
            <ArrowRight />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default DayBoxHeader
