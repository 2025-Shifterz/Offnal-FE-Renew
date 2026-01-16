import React from 'react'
import { Text, View } from 'react-native'
import TimePicker from './TimePicker'

interface TimeTypeInputProps {
  text: string
}

const TimeTypeInput = ({ text }: TimeTypeInputProps) => {
  let type: 'D' | 'E' | 'N' = 'D'

  if (text === '주간') type = 'D'
  if (text === '오후') type = 'E'
  if (text === '야간') type = 'N'

  return (
    <View className="flex-row items-center gap-[13px]">
      <Text className="px-[7px] py-[5px] text-text-subtle heading-xxxs">
        {text}
      </Text>
      <View className="flex-row items-center gap-[6px]">
        <TimePicker type={type} mode="startTime" />
        <Text>-</Text>
        <TimePicker type={type} mode="endTime" />
      </View>
    </View>
  )
}

export default TimeTypeInput
