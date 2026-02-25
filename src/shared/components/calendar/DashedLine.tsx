import React from 'react'
import { Dimensions, View } from 'react-native'

const screenWidth = Dimensions.get('window').width

const CustomDashedLine = () => {
  const segmentWidth = 7 + 4 // 선 7px + 공백 4px
  const repeatCount = Math.ceil(screenWidth / segmentWidth)

  return (
    <View className="h-[0.5px] flex-row bg-surface-white">
      {Array.from({ length: repeatCount }).map((_, index) => (
        <React.Fragment key={index}>
          <View className="w-[7px] bg-divider-gray-light" />
          <View className="w-[4px] bg-transparent" />
        </React.Fragment>
      ))}
    </View>
  )
}

export default CustomDashedLine
