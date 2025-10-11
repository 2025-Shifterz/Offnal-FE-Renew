import React from 'react'
import { View, Text } from 'react-native'

interface TooltipBubbleProps {
  children: React.ReactNode
  style?: any // View 스타일을 받을 수 있도록 any로 설정
}

const TooltipBubble = ({ children, style }: TooltipBubbleProps) => {
  return (
    <View style={style} className="absolute z-10">
      <View
        className="items-center rounded-full bg-surface-white px-number-6 py-number-3 shadow-md"
        style={{
          backgroundColor: '#E0F7FA', // 라이트 블루 (이미지 색상에 맞춰 조정)
          borderColor: '#B2EBF2', // 테두리 색상
          borderWidth: 1,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-text-bolder body-xxs">{children}</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          marginLeft: -8,
          width: 16,
          height: 16,
          backgroundColor: '#E0F7FA',
          borderColor: '#B2EBF2',
          borderWidth: 1,
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate: '45deg' }],
          borderRadius: 2,
        }}
      />
    </View>
  )
}

export default TooltipBubble
