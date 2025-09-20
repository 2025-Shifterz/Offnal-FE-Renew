import React from 'react'
import NoTodoIcon from '../../../assets/icons/noTodo.svg'

import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface EmptyTodoContentProps {
  text: string
  divStyle?: string
  textStyle?: string
  iconSize: number
}

const EmptyMessage = ({
  text,
  divStyle,
  textStyle,
  iconSize,
}: EmptyTodoContentProps) => {
  return (
    <View className={twMerge('items-center gap-[19px]', divStyle)}>
      <NoTodoIcon width={iconSize} />
      <View>
        <Text
          style={{ color: '#B1B8BE' }}
          className={twMerge('body-s text-center', textStyle)}
        >{`아직 등록된  ${text}${text === '할 일' ? '이' : '가'} 없어요.`}</Text>
        <Text
          style={{ color: '#B1B8BE' }}
          className={twMerge('body-s text-center', textStyle)}
        >
          {text === '할 일'
            ? '근무일정에 따른 할 일 리스트를 만들어보세요.'
            : '메모를 작성해보세요.'}
        </Text>
      </View>
    </View>
  )
}

export default EmptyMessage
