import React from 'react'
import { Text, View } from 'react-native'

/**
 * ### HeadLineTextProps
 * @property heading - 메인 헤드라인 텍스트 (Heading)
 * @property description - 부가 설명 텍스트 (Optional)
 */
interface HeadLineTextProps {
  heading: string
  description?: string
}

/**
 * ### HeadLineText
 *
 * 화면 상단에 위치하는 메인 타이틀과 서브 타이틀을 보여주는 컴포넌트입니다.
 * 기존 TitleMessage를 대체합니다.
 */
const HeadLineText = ({ heading, description }: HeadLineTextProps) => {
  return (
    <View className="flex-col gap-[12px]">
      <Text className="text-text-bolder heading-m">{heading}</Text>
      {description && (
        <Text className="text-text-subtle label-xs">{description}</Text>
      )}
    </View>
  )
}

export default HeadLineText
