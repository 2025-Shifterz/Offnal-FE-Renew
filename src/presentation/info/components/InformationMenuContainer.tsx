import { TouchableOpacity, View } from 'react-native'
import ChevronRightIcon from '../../../assets/icons/ic_chervon_right.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

interface MenuProps {
  menuTitle: string
  menuItems: MenuItemProps[]
}

const InformationMenuContainer = ({ menuTitle, menuItems }: MenuProps) => {
  return (
    <View className="overflow-hidden rounded-radius-xl bg-surface-white py-number-5">
      <InformationMenuTitle title={menuTitle} />
      {menuItems.map(item => (
        <InformationMenuItem
          key={item.id}
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
      <GlobalText className="w-full px-number-8 py-[9px] font-pretSemiBold text-heading-xxxs text-text-subtle">
        {title}
      </GlobalText>
    )
  )
}

export interface MenuItemProps {
  id: string
  title: string
  caption?: string
  onPress: () => void
}

const InformationMenuItem = ({ title, caption, onPress }: MenuItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between px-number-8 py-[10px]"
    >
      <GlobalText className="font-pretMedium text-body-xxs text-text-subtle">
        {title}
      </GlobalText>
      {caption ? (
        <GlobalText className="font-pretRegular text-label-xxs text-text-disabled">
          {caption}
        </GlobalText>
      ) : (
        <ChevronRightIcon width={20} height={20} />
      )}
    </TouchableOpacity>
  )
}

export default InformationMenuContainer
