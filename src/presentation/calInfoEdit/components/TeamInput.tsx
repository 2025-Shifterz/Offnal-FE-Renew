import React, { useState } from 'react'
import { Text, View } from 'react-native'
import TeamItem from '../../schedule/component/TeamItem'

interface TeamInputProps {
  setWorkGroup: (text: string) => void
}

const TeamInput = ({ setWorkGroup }: TeamInputProps) => {
  const [selectedBoxId, setSelectedBoxId] = useState(1)

  return (
    <View className="flex gap-[9px]">
      <Text className="text-text-subtle heading-xxxs">근무조 입력</Text>
      <View className="flex h-[54px] gap-4 rounded-lg bg-white px-[15px] py-[11px]">
        <View className="flex-row gap-[8px]">
          {[1, 2, 3, 4].map(id => (
            <TeamItem
              key={id}
              id={id}
              onPress={() => {
                setSelectedBoxId(id)
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
