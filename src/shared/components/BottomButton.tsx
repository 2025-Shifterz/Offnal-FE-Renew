import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface BottomButtonProps {
  text: string
  onPress: () => void
}

const BottomButton = ({ text, onPress }: BottomButtonProps) => {
  return (
    <View className="absolute bottom-[18px] w-full">
      <TouchableOpacity
        className="flex w-full items-center rounded-radius-xl bg-surface-inverse py-[13px]"
        onPress={onPress}
      >
        <Text className="text-text-bolder-inverse body-m">{text}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BottomButton
