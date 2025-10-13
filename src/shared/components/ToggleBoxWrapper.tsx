import React from 'react'
import { TouchableOpacity } from 'react-native'
import { twMerge } from 'tailwind-merge'

// 토글 시 스타일 변경되는 박스 래퍼 컴포넌트
interface ToggleBoxWrapperProps {
  id: number
  isSelected: boolean
  boxStyle: string
  onPress: (id: number) => void // 부모로부터 id를 인자로 받음
  children?: React.ReactNode
}

const ToggleBoxWrapper = ({
  id,
  isSelected,
  boxStyle,
  onPress,
  children,
}: ToggleBoxWrapperProps) => {
  // 클릭 시 자신의 id를 부모에게 전달
  const handlePress = () => {
    onPress(id)
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
