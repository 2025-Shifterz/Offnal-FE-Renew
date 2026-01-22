import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import TimeFrame from '../../../shared/components/calendar/TimeFrame'
import { WorkType } from '../../../shared/types/Calendar'
import { fromShiftType } from '../../../data/mappers/ShiftTypeMapper'
import { WorkTime } from '../../../shared/types/WorkTime'

interface SelectShiftBoxProps {
  selectedBoxId: number
  setSelectedBoxId: (id: number) => void
  handleTypeSelect: (type: WorkType) => void
  workTimes: WorkTime
}

// 근무형태 선택 박스 map 데이터
const shiftTypes: { id: number; text: WorkType }[] = [
  { id: 1, text: '주간' },
  { id: 2, text: '오후' },
  { id: 3, text: '야간' },
  { id: 4, text: '휴일' },
]

const SelectShiftBox = ({
  selectedBoxId,
  setSelectedBoxId,
  handleTypeSelect,
  workTimes,
}: SelectShiftBoxProps) => {
  return (
    <View className="gap-[7px]">
      {shiftTypes.map(({ id, text }) => {
        const key = fromShiftType(text)
        const time = workTimes[key]
        const isSelected = selectedBoxId === id
        const selectedDivStyle = isSelected
          ? 'border-border-primary bg-surface-primary-light'
          : ''
        const selectedTextStyle = isSelected ? 'text-text-primary' : ''

        return (
          <TouchableOpacity
            key={id}
            onPress={() => {
              setSelectedBoxId(id)
              handleTypeSelect(text)
            }}
            className={twMerge(
              'flex-row items-center justify-between rounded-radius-l border-[0.5px] border-border-gray-light px-p-6 py-p-4',
              selectedDivStyle
            )}
          >
            <View className="gap-[3px]">
              <Text
                className={twMerge(
                  'text-text-basic heading-xxxs',
                  selectedTextStyle
                )}
              >
                {text}
              </Text>
              <Text
                className={twMerge(
                  'text-text-disabled label-xs',
                  selectedTextStyle
                )}
              >
                {`${time.startTime}~${time.endTime}`}
              </Text>
            </View>
            <TimeFrame text={text} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default SelectShiftBox
