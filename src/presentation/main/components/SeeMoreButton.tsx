import React from 'react'
import { TouchableOpacity } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'

interface SeeMoreButtonProps {
  isExpended: boolean
  onClickExpand: () => void
}

const SeeMoreButton = ({ isExpended, onClickExpand }: SeeMoreButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      className="mb-2 w-20 rounded-[5px] bg-background-gray-subtle2 px-number-6 py-number-4"
      onPress={() => onClickExpand()}
    >
      <GlobalText className="text-text-subtle body-xxs">
        {isExpended ? '접기' : '더보기 . .'}
      </GlobalText>
    </TouchableOpacity>
  )
}

export default SeeMoreButton
