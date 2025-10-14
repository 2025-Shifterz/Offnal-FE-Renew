import React from 'react'
import { TouchableOpacity } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { ScheduleType } from '../types/ScheduleScopeType'
import { ScheduleRegMethod } from '../types/ScheduleRegMethod'
import { PhotoType } from '../types/PhotoType'

// 토글 시 스타일 변경되는 박스 래퍼 컴포넌트
interface ToggleBoxWrapperProps<
  T extends ScheduleRegMethod | ScheduleType | PhotoType,
> {
  type: T
  isSelected: boolean
  boxStyle: string
  onPress: (type: T) => void // 부모로부터 id를 인자로 받음
  children?: React.ReactNode
}

const ToggleBoxWrapper = <
  T extends ScheduleRegMethod | ScheduleType | PhotoType,
>({
  type,
  isSelected,
  boxStyle,
  onPress,
  children,
}: ToggleBoxWrapperProps<T>) => {
  // 클릭 시 자신의 type을 부모에게 전달
  const handlePress = () => {
    onPress(type)
  }

  const selectedStyle = isSelected
    ? 'border border-border-primary bg-surface-primary-light-2'
    : 'bg-surface-white'

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={twMerge(selectedStyle, boxStyle)}
    >
      {children}
    </TouchableOpacity>
  )
}

export default ToggleBoxWrapper
