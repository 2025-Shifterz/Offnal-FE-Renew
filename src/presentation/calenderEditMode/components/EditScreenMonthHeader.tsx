import React, { Dispatch, SetStateAction } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Dayjs } from 'dayjs'

import ArrowLeft from '../../../assets/icons/black-arrow-l.svg'
import ArrowRight from '../../../assets/icons/black-arrow-r.svg'
const arrowStyle =
  'size-[24px] items-center justify-center rounded-radius-max bg-surface-white'

// 이름 바꾸기
interface EditScreenMonthHeaderProps {
  currentDate: Dayjs
  setCurrentDate: (date: Dayjs) => void
  setSelectedYearMonth: Dispatch<
    SetStateAction<{ year: number; month: number }>
  >
}

const EditScreenMonthHeader = ({
  currentDate,
  setCurrentDate,
  setSelectedYearMonth,
}: EditScreenMonthHeaderProps) => {
  const handlePrevMonth = () => {
    const newDate = currentDate.subtract(1, 'month')
    setCurrentDate(newDate)
    setSelectedYearMonth({
      year: newDate.year(),
      month: newDate.month() + 1,
    })
  }

  const handleNextMonth = () => {
    const newDate = currentDate.add(1, 'month')
    setCurrentDate(newDate)
    setSelectedYearMonth({
      year: newDate.year(),
      month: newDate.month() + 1,
    })
  }
  return (
    <View className="flex-row items-center gap-[10px]">
      <TouchableOpacity className={arrowStyle} onPress={handlePrevMonth}>
        <ArrowLeft />
      </TouchableOpacity>
      <Text className="text-text-basic body-s">
        {currentDate.format('M월')}
      </Text>
      <TouchableOpacity className={arrowStyle} onPress={handleNextMonth}>
        <ArrowRight />
      </TouchableOpacity>
    </View>
  )
}

export default EditScreenMonthHeader
