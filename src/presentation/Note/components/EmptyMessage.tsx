import React from 'react'
import NoTodoIcon from '../../../assets/icons/NoTodo.svg'

import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import GlobalText from '../../../shared/components/GlobalText'

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
        <GlobalText
          style={{ color: '#B1B8BE' }}
          className={twMerge('text-center body-xs', textStyle)}
        >{`아직 등록된  ${text}${text === '할 일' ? '이' : '가'} 없어요.`}</GlobalText>
        <GlobalText
          style={{ color: '#B1B8BE' }}
          className={twMerge('text-center body-xs', textStyle)}
        >
          {text === '할 일'
            ? '근무일정에 따른 할 일 리스트를 만들어보세요.'
            : '메모를 작성해보세요.'}
        </GlobalText>
      </View>
    </View>
  )
}

export default EmptyMessage
