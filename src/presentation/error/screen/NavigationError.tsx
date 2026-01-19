import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-svg'

const NavigationErrorScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-red-400">
      <Text>Navigation Error occurred</Text>
    </View>
  )
}

export default NavigationErrorScreen
