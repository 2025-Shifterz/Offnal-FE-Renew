import React from 'react'
import { Text, TextProps } from 'react-native'

type Props = TextProps & {
  className?: string
  children: React.ReactNode
}

const GlobalText = ({ children, className = '', ...props }: Props) => {
  return (
    <Text className={`font-pretRegular ${className}`} {...props}>
      {children}
    </Text>
  )
}

export default GlobalText
