import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { twMerge } from 'tailwind-merge'
import TimeFrame, {
  TimeFrameChildren,
} from '../../../shared/components/calendar/TimeFrame'

interface SelectShiftBoxProps {
  boxId: number
  typeText: TimeFrameChildren
  isSelected: boolean
  onSelect: () => void
  handleTypeSelect: () => void
  startTime?: string
  endTime?: string
}

const SelectShiftBox = ({
  typeText,
  isSelected,
  onSelect,
  handleTypeSelect,
  startTime,
  endTime,
}: SelectShiftBoxProps) => {
  const selectedDivStyle = isSelected
    ? 'border-border-primary bg-surface-primary-light'
    : ''
  const selectedTextStyle = isSelected ? 'text-text-primary' : ''

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect()
        handleTypeSelect()
      }}
      className={twMerge(
        'flex-row items-center justify-between rounded-radius-l border-[0.5px] border-border-gray-light px-p-6 py-p-4',
        selectedDivStyle
      )}
    >
      <View className="gap-[3px]">
        <Text
          className={twMerge('text-text-basic heading-xxxs', selectedTextStyle)}
        >
          {typeText}
        </Text>
        <Text
          className={twMerge('text-text-disabled label-xs', selectedTextStyle)}
        >
          {startTime ?? '--:--'}~{endTime ?? '--:--'}
        </Text>
      </View>
      <TimeFrame text={typeText} />
    </TouchableOpacity>
  )
}

export default SelectShiftBox
