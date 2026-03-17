import { TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface ToggleSwitchProps {
  disabled?: boolean
  value: boolean
  onValueChange: (nextValue: boolean) => void
}

const ToggleSwitch = ({
  disabled = false,
  value,
  onValueChange,
}: ToggleSwitchProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className={twMerge(
        'h-[27px] w-[46px] justify-center rounded-radius-max px-[2px]',
        value
          ? 'items-end bg-surface-primary'
          : 'items-start bg-surface-disabled',
        disabled ? 'opacity-50' : ''
      )}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
    >
      <View className="h-[22px] w-[22px] rounded-radius-max bg-surface-white" />
    </TouchableOpacity>
  )
}

export default ToggleSwitch
