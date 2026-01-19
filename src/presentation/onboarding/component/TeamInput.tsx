import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import TeamItem from './TeamItem'
import { twMerge } from 'tailwind-merge'

interface TeamInputProps {
  workGroup: string
  setWorkGroup: (text: string) => void
  isDirect: boolean
  setIsDirect: (bool: boolean) => void
}

const TeamInput = ({
  workGroup,
  setWorkGroup,
  isDirect,
  setIsDirect,
}: TeamInputProps) => {
  const [selectedBoxId, setSelectedBoxId] = useState(1)

  const directInputStyle = isDirect
    ? 'border-border-primary bg-surface-primary-light-2'
    : 'border-border-gray-light'
  const directInputTextStyle = isDirect
    ? 'text-text-primary'
    : 'text-text-disabled'

  return (
    <View className="flex gap-[9px]">
      <Text className="text-text-subtle heading-xxxs">근무조 입력</Text>
      <View className="flex h-[60px] justify-center  gap-4 rounded-lg bg-white px-[15px] py-[11px]">
        <View className="flex-row gap-[8px]">
          {[1, 2, 3, 4].map(id => (
            <TeamItem
              key={id}
              id={id}
              onPress={() => {
                setSelectedBoxId(id)
                setIsDirect(false)
                setWorkGroup(`${id}조`)
              }}
              isSelected={selectedBoxId === id}
              text={`${id}조`}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

export default TeamInput
