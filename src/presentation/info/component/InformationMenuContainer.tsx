import { TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'

interface MenuProps {
  menuTitle: string
  menuItems: MenuItemProps[]
}

const InformationMenuContainer = ({ menuTitle, menuItems }: MenuProps) => {
  return (
    <View className="rounded-3xl bg-white py-number-3">
      <InformationMenuTitle title={menuTitle} />
      {menuItems.map(item => (
        <InformationMenuItem
          id={item.id}
          title={item.title}
          caption={item.caption}
          onPress={item.onPress}
        />
      ))}
    </View>
  )
}

type InformationMenuTitleProps = {
  title?: string
}

const InformationMenuTitle = ({ title }: InformationMenuTitleProps) => {
  return (
    title && (
      <GlobalText className="w-full px-number-8 py-[9px] font-pretMedium text-body-xxs">
        {title}
      </GlobalText>
    )
  )
}

export interface MenuItemProps {
  id: string
  title: string
  caption?: string
  onPress: (id: string) => void
}

const InformationMenuItem = ({
  id,
  title,
  caption,
  onPress,
}: MenuItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className="flex-row justify-between px-number-8 py-[9px]"
    >
      <GlobalText className="font-pretMedium text-body-xs">{title}</GlobalText>
      {caption && (
        <GlobalText className="font-pretMedium text-body-xxs text-text-disabled">
          {caption}
        </GlobalText>
      )}
    </TouchableOpacity>
  )
}

export default InformationMenuContainer
