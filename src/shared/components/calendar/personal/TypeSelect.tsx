import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import TimeFrame, { TimeFrameChildren } from '../TimeFrame'
import DashedDivider from '../../divider/DashedDivider'

const types: TimeFrameChildren[] = ['주간', '오후', '야간', '휴일']

interface TypeSelectProps {
  onPress: (type: TimeFrameChildren) => void
}

// onPress('주간')을 호출하면 handleTypeSelect('주간')을 실행하게 된다.
const TypeSelect = ({ onPress }: TypeSelectProps) => {
  return (
    <>
      <DashedDivider />
      <TouchableOpacity className="flex-col gap-[9px] rounded-b-radius-xl bg-surface-white p-[11px]">
        <Text className="text-text-subtle body-xs">근무 형태 입력</Text>
        <View className="flex-row gap-[6px]">
          {types.map(type => (
            <TimeFrame key={type} text={type} onPress={() => onPress(type)} />
          ))}
        </View>
      </TouchableOpacity>
    </>
  )
}

export default TypeSelect
