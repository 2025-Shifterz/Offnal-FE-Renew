import React from 'react'
import { View, Text } from 'react-native'

interface TooltipBubbleProps {
  children: React.ReactNode
  style?: any // View 스타일을 받을 수 있도록 any로 설정
}

const TooltipBubble = ({ children, style }: TooltipBubbleProps) => {
  return (
    <View style={style}>
      <View className="relative bottom-9 left-20 shadow-md">
        <View
          className=" z-10 items-center rounded-radius-m bg-surface-white px-number-6 py-number-3 "
          style={{
            backgroundColor: '#FFF',
            borderRadius: 8,
          }}
        >
          <Text className=" text-text-bolder body-xxs">{children}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 14,
            left: '20%',
            marginLeft: -8,
            width: 12,
            height: 12,
            backgroundColor: '#FFF',
            transform: [{ rotate: '45deg' }],
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  )
}

export default TooltipBubble
