import React from 'react'
import { Text, View } from 'react-native'

interface TitleMessageProps {
  title: string
  subTitle?: string
}

const TitleMessage = ({ title, subTitle }: TitleMessageProps) => {
  return (
    <View className="flex-col gap-[12px]">
      <Text className="text-text-bolder heading-m">{title}</Text>
      {subTitle && (
        <Text className="text-text-subtle label-xs">{subTitle}</Text>
      )}
    </View>
  )
}

export default TitleMessage
