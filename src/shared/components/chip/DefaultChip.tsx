import { TouchableOpacity } from 'react-native'
import { twMerge } from 'tailwind-merge'
import GlobalText from '../GlobalText'

interface DefaultChipProps {
  id: number
  text: string
  isSelected: boolean
  onPress: (id: number) => void
}

const DefaultChip = ({ id, text, isSelected, onPress }: DefaultChipProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={twMerge(
        'rounded-radius-max border-[0.5px] border-border-gray-light px-[14px] py-[8px]',
        isSelected ? 'border-border-primary bg-surface-primary-light-2' : ''
      )}
    >
      <GlobalText
        className={twMerge(
          'text-text-disabled label-xs',
          isSelected ? 'text-text-primary' : ''
        )}
      >
        {text}
      </GlobalText>
    </TouchableOpacity>
  )
}

export default DefaultChip
