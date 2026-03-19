import { TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import CheckedIcon from '../../assets/icons/checked.svg'

type CheckboxProps = {
  checked: boolean
  disabled?: boolean
  onPress?: () => void
  size?: number
}

const Checkbox = ({
  checked,
  disabled = false,
  onPress,
  size = 16,
}: CheckboxProps) => {
  const Container = onPress ? TouchableOpacity : View

  return (
    <Container
      {...(onPress ? { activeOpacity: 0.85, onPress } : {})}
      className={twMerge(
        'items-center justify-center rounded-[2px]',
        checked
          ? 'bg-surface-white'
          : 'border-[0.5px] border-[#0000001A] bg-surface-gray-subtle2',
        disabled ? 'opacity-50' : ''
      )}
      style={{ width: size, height: size }}
    >
      {checked ? <CheckedIcon width={size} height={size} /> : null}
    </Container>
  )
}

export default Checkbox
