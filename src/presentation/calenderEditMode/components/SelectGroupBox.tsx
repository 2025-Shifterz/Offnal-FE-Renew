import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface SelectGroupBoxProps {
  selectedGroup: number
  setSelectedGroup: (group: number) => void
}

const SelectGroupBox = ({
  selectedGroup,
  setSelectedGroup,
}: SelectGroupBoxProps) => {
  const groups = [1, 2, 3, 4]
  return (
    <View className="flex-row gap-2">
      {groups.map(group => {
        const isSelected = selectedGroup === group
        return (
          <TouchableOpacity
            key={group}
            onPress={() => setSelectedGroup(group)}
            className={`rounded border px-4 py-3 ${
              isSelected
                ? 'border-border-primary bg-surface-primary-light'
                : 'border-border-gray-light bg-white '
            }`}
          >
            <Text
              className={isSelected ? 'text-text-primary' : 'text-text-basic'}
            >
              {group}조
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default SelectGroupBox
