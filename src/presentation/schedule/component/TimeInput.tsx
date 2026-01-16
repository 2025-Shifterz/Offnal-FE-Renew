import React from 'react'
import { Text, View } from 'react-native'
import TimeTypeInput from './TimeTypeInput'

const TimeInput = () => {
  return (
    <View className="flex gap-[9px]">
      <Text className="text-text-subtle heading-xxxs">근무 시간 입력</Text>
      <View className="flex gap-[8px] rounded-lg bg-white px-[11px] py-[16.5px]">
        <TimeTypeInput text="주간" />
        <TimeTypeInput text="오후" />
        <TimeTypeInput text="야간" />
      </View>
    </View>
  )
}

export default TimeInput
