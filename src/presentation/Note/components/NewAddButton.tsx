import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import PlusIcon from '../../../assets/icons/w-plus.svg'

interface NewAddButtonProps {
  handleAdd: () => void
  text: string
}

const NewAddButton = ({ handleAdd, text }: NewAddButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handleAdd}
      className="rounded-radius-m1 bg-surface-primary h-[40px] flex-row items-center justify-center gap-[5px] px-[10px] py-[8px]"
    >
      <PlusIcon />
      <Text className="text-text-inverse-static body-m items-center">{`새 ${text} 추가하기`}</Text>
    </TouchableOpacity>
  )
}

export default NewAddButton
