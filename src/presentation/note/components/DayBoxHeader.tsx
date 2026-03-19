import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import ArrowLeft from '../../../assets/icons/black-arrow-l.svg'
import ArrowRight from '../../../assets/icons/black-arrow-r.svg'

import dayjs, { Dayjs } from 'dayjs'
import DateTimeChip from '../../../shared/components/chip/DateTimeChip'

const arrowStyle =
  'size-[24px] items-center justify-center rounded-radius-max bg-surface-white'

interface DayBoxHeaderProps {
  currentDate: Dayjs
  setCurrentDate: (date: Dayjs) => void
}

const DayBoxHeader = ({ currentDate, setCurrentDate }: DayBoxHeaderProps) => {
  const isToday = currentDate.isSame(dayjs(), 'day')
  const handlePrevDate = () => {
    setCurrentDate(currentDate.subtract(1, 'day'))
  }

  const handleNextDate = () => {
    setCurrentDate(currentDate.add(1, 'day'))
  }

  return (
    <View className="flex-row items-center justify-between rounded-tl-radius-xl rounded-tr-radius-xl bg-surface-primary-subtle px-p-6 py-p-3">
      <TouchableOpacity onPress={handlePrevDate} className={arrowStyle}>
        <ArrowLeft />
      </TouchableOpacity>
      <DateTimeChip date={currentDate} />
      <View className="w-[24px]">
        <TouchableOpacity onPress={handleNextDate} className={arrowStyle}>
          <ArrowRight />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DayBoxHeader
