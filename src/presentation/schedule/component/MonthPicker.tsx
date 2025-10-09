import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'

import ChervonLeft from '../../../assets/icons/ic_chervon_left.svg'
import ChervonRight from '../../../assets/icons/ic_chervon_right.svg'

type MonthPickerProps = {
  onDateChange: (year: number, month: number | null) => void
}

export const MonthPicker = ({ onDateChange }: MonthPickerProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const months = [
    { id: 1, name: '1월' },
    { id: 2, name: '2월' },
    { id: 3, name: '3월' },
    { id: 4, name: '4월' },
    { id: 5, name: '5월' },
    { id: 6, name: '6월' },
    { id: 7, name: '7월' },
    { id: 8, name: '8월' },
    { id: 9, name: '9월' },
    { id: 10, name: '10월' },
    { id: 11, name: '11월' },
    { id: 12, name: '12월' },
  ]

  useEffect(() => {
    onDateChange(currentYear, selectedMonth)
  }, [currentYear, selectedMonth, onDateChange])

  const handlePrevYear = () => {
    setCurrentYear(prevYear => prevYear - 1)
  }

  const handleNextYear = () => {
    setCurrentYear(prevYear => prevYear + 1)
  }

  const handleMonthSelect = (monthId: number | null) => {
    setSelectedMonth(monthId)
    console.log(`Selected Month: ${monthId} for year ${currentYear}`)
  }

  type Month = { id: number; name: string }

  const renderMonthItem = ({ item }: { item: Month }) => {
    const isSelected = selectedMonth === item.id
    return (
      <TouchableOpacity
        className={`flex w-1/4 items-center justify-center ${isSelected ? 'bg-surface-primary-light-2' : 'bg-surface-white py-[18px]'}`}
        key={item.id}
        onPress={() => handleMonthSelect(item.id)}
      >
        <Text
          className={
            isSelected
              ? 'text-text-primary label-xs'
              : 'text-text-basic label-xs'
          }
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-col overflow-hidden rounded-radius-l bg-background-white">
      <View className="flex-row items-center justify-center py-number-7">
        <TouchableOpacity onPress={handlePrevYear}>
          <ChervonLeft />
        </TouchableOpacity>
        <Text className="text-text-subtle body-m">{currentYear}년</Text>
        <TouchableOpacity onPress={handleNextYear}>
          <ChervonRight />
        </TouchableOpacity>
      </View>

      <View className="mt-number-2 h-number-1 w-full bg-surface-disabled" />

      <View className="flex-row flex-wrap justify-start">
        {months.map(month => renderMonthItem({ item: month }))}
      </View>
    </View>
  )
}
