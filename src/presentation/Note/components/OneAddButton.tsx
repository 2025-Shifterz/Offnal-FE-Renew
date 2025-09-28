import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import AddIcon from '../../../assets/icons/todo-add.svg'
import GlobalText from '../../../shared/GlobalText'

interface AddButtonProps {
  text: string
  addOneTodo: () => void
}

const OneAddButton = ({ text, addOneTodo }: AddButtonProps) => {
  return (
    <View className="mt-[8px] items-center">
      <TouchableOpacity
        onPress={addOneTodo}
        className="w-[93px] flex-row items-center justify-center gap-[5px] rounded-radius-max bg-surface-white py-[8px]"
      >
        <AddIcon />
        <GlobalText className="text-text-disabled-on body-xs">{`${text} 추가`}</GlobalText>
      </TouchableOpacity>
    </View>
  )
}

export default OneAddButton
