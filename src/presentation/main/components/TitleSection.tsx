import { Text, TouchableOpacity, View } from 'react-native'
import TooltipIcon from '../../../assets/icons/ic_information_circle_16.svg'
import AddIcon from '../../../assets/icons/ic_add_16.svg'

interface SectionWithTooltipIconProps {
  title: string
  onPressIcon: () => void
}

interface SectionWithAddableBtnProps {
  title: string
  btnContent: string
  onPressIcon: () => void
}

const WithTooltipIcon: React.FC<SectionWithTooltipIconProps> = ({
  title,
  onPressIcon,
}) => {
  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-start gap-g-2">
        <Text className="text-black heading-xxs">{title}</Text>
        <TouchableOpacity onPress={() => onPressIcon()}>
          <TooltipIcon />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const WithAddableBtn: React.FC<SectionWithAddableBtnProps> = ({
  title,
  btnContent,
  onPressIcon,
}) => {
  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between gap-g-2">
        <Text className="text-black heading-xxs">{title}</Text>

        <TouchableOpacity onPress={onPressIcon}>
          <View className="flex-row items-center gap-g-2">
            <Text className="text-text-subtle-inverse heading-xxxxs">
              {btnContent}
            </Text>
            <AddIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const OnlyTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View className="flex-row items-center justify-start gap-g-2">
      <Text className="text-black heading-xxs">{title}</Text>
    </View>
  )
}

export default { WithTooltipIcon, WithAddableBtn, OnlyTitle }
