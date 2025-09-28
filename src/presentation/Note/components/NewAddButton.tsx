import React from 'react'
import { TouchableOpacity } from 'react-native'
import PlusIcon from '../../../assets/icons/w-plus.svg'
import GlobalText from '../../../shared/GlobalText'

interface NewAddButtonProps {
  handleAdd: () => void
  text: string
}

const NewAddButton = ({ handleAdd, text }: NewAddButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handleAdd}
      className="h-[40px] flex-row items-center justify-center gap-[5px] rounded-radius-m1 bg-surface-primary px-[10px] py-[8px]"
    >
      <PlusIcon />
      <GlobalText className="items-center text-text-inverse-static body-m">{`새 ${text} 추가하기`}</GlobalText>
    </TouchableOpacity>
  )
}

export default NewAddButton
