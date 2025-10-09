import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface TeamProps {
  id: number
  text: string
  isSelected: boolean
  onPress: (id: number) => void
}

const TeamItem = ({ id, onPress, isSelected, text }: TeamProps) => {
  const handlePress = () => {
    onPress(id)
  }
  const divSelectedStyle = isSelected
    ? ' border-border-primary  bg-surface-primary-light-2'
    : ''
  const textSelectedStyle = isSelected ? 'text-text-primary' : ''
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={twMerge(
        'rounded-radius-max border-[0.5px] border-border-gray-light px-[14px] py-[8px]',
        divSelectedStyle
      )}
    >
      <Text
        className={twMerge('text-text-disabled label-xs', textSelectedStyle)}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

export default TeamItem
