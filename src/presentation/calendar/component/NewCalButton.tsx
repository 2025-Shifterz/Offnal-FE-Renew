import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import PlusIcon from '../../../assets/icons/w-plus.svg'

interface NewCalButtonProps {
  onCreateSchedule: () => void
}

const NewCalButton = ({ onCreateSchedule }: NewCalButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onCreateSchedule}
      className="h-[40px] flex-row items-center justify-center gap-[5px] rounded-radius-m1 bg-surface-primary px-[10px] py-[8px]"
    >
      <PlusIcon />
      <Text className="items-center text-text-inverse-static body-m">
        {'근무표 생성하기'}
      </Text>
    </TouchableOpacity>
  )
}

export default NewCalButton
