import React from 'react'
import { View } from 'react-native'
import EmptyMessage from './EmptyMessage'
import NewAddButton from './NewAddButton'

interface EmptyTodoProps {
  handleAdd: () => void
  text: string
}

const EmptyPage = ({ handleAdd, text }: EmptyTodoProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-[41px]">
      <EmptyMessage
        iconSize={96}
        text={text}
        divStyle="gap-[41px]"
        textStyle="text-body-m"
      />
      <NewAddButton handleAdd={handleAdd} text={text} />
    </View>
  )
}

export default EmptyPage
