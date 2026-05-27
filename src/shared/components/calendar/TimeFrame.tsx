import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ShiftType } from '../../types/Calendar'

// TimeFrameChildren을 ShiftType과 동일하게 정의
export type TimeFrameChildren = ShiftType

interface TimeFrameProps {
  text: ShiftType
  onPress?: () => void
}

const stylesMap: Record<
  ShiftType,
  { backgroundColor: string; textColor?: string }
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
  '근무 없음': {
    backgroundColor: 'bg-surface-gray-subtle1',
  },
} as const

const TimeFrame: React.FC<TimeFrameProps> = ({
  text,
  onPress,
}: TimeFrameProps) => {
  const currentStyle = stylesMap[text]

  if (!currentStyle) {
    console.warn(`Unknown WorkType: ${text}`)
    return null // 렌더링 안함
  }

  if (text === '근무 없음') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        disabled={!onPress}
        className={`h-[24px] w-[29px] rounded-[6px] ${currentStyle.backgroundColor}`}
        style={styles.noWorkChip}
      />
    )
  }

  // onPress를 호출하는 것은, 위에서 받은 handleTypeSelect('주간')을 그대로 실행하는 것이다.
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className={`flex h-[26px] w-[30px] items-center justify-center rounded-radius-xs ${currentStyle.backgroundColor}`}
    >
      <Text className={`heading-xxxxs ${currentStyle.textColor}`}>{text}</Text>
    </TouchableOpacity>
  )
}

export default TimeFrame

const styles = StyleSheet.create({
  noWorkChip: {
    borderColor: '#cdd1d5',
    borderStyle: 'dashed',
    borderWidth: 0.5,
  },
})
