import { View, Text, TouchableOpacity } from 'react-native'

type MenuItemProps = {
  menuTitle: string
  onPress: () => void
}

type MenuHeaderProps = { headerTitle: string }

const Header = ({ headerTitle }: MenuHeaderProps) => {
  return (
    <View className="w-full flex-1 justify-start px-number-8 py-number-5">
      <Text className="text-text-subtle body-xxs">{headerTitle}</Text>
    </View>
  )
}

const Item = ({ menuTitle, onPress }: MenuItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-full flex-1 justify-start px-number-8 py-number-5">
        <Text className="text-text-basic body-xs">{menuTitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default { Header, Item }
