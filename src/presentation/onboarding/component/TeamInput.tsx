import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import TeamItem from './TeamItem'

interface TeamInputProps {
  setWorkGroup: (text: string) => void
}

const TeamInput = ({ setWorkGroup }: TeamInputProps) => {
  // 초기값 설정
  // workGroup에서 숫자 추출

  const [selectedBoxId, setSelectedBoxId] = useState(1)

  useEffect(() => {
    setSelectedBoxId(1)
    setWorkGroup('1조')
  }, [])

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
