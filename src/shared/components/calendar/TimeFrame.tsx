// 주간, 오후, 야간, 휴일 - 박스들

import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ShiftType } from '../../../data/model/Calendar'

// TimeFrameChildren을 ShiftType과 동일하게 정의
export type TimeFrameChildren = ShiftType

interface TimeFrameProps {
  text: ShiftType
  onPress?: () => void
}

const stylesMap: Record<
  ShiftType,
  { backgroundColor: string; textColor: string }
> = {
  주간: {
    backgroundColor: 'bg-surface-secondary-subtle',
    textColor: 'text-text-subtle',
  },
  오후: {
    backgroundColor: 'bg-surface-success-subtle',
    textColor: 'text-text-success',
  },
  야간: {
    backgroundColor: 'bg-surface-information-subtle',
    textColor: 'text-text-information',
  },
  휴일: {
    backgroundColor: 'bg-surface-danger-subtle',
    textColor: 'text-text-danger',
  },
} as const

const TimeFrame: React.FC<TimeFrameProps> = ({
  text,
  onPress,
}: TimeFrameProps) => {
  const currentStyle = stylesMap[text]

  // onPress를 호출하는 것은, 위에서 받은 handleTypeSelect('주간')을 그대로 실행하는 것이다.
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex h-[26px] w-[30px] items-center justify-center rounded-radius-xs ${currentStyle.backgroundColor}`}
    >
      <Text className={`heading-xxxxs ${currentStyle.textColor}`}>{text}</Text>
    </TouchableOpacity>
  )
}

export default TimeFrame
