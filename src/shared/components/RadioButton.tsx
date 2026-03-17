import { TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface RadioButtonProps {
  disabled?: boolean
  onPress?: () => void
  selected: boolean
}

const RadioButton = ({
  disabled = false,
  onPress,
  selected,
}: RadioButtonProps) => {
  const Container = onPress ? TouchableOpacity : View

  return (
    <Container
      {...(onPress ? { activeOpacity: 0.85, onPress } : {})}
      className={twMerge(
        'size-[14px] items-center justify-center rounded-radius-max',
        selected
          ? 'bg-surface-primary'
          : 'border-2 border-surface-disabled bg-surface-white',
        disabled ? 'opacity-50' : ''
      )}
    >
      <View
        className={twMerge(
          'rounded-radius-max bg-surface-white',
          selected ? 'size-[7px]' : 'size-[10px]'
        )}
      />
    </Container>
  )
}

export default RadioButton
