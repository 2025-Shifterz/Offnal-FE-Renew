import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'
import CheckIcon from '../../../assets/icons/checked.svg'

interface CheckBoxMenuItemProps {
  title: string
  isChecked: boolean
  onChecked: () => void
}

const CheckBoxMenuItem = ({
  title,
  isChecked,
  onChecked,
}: CheckBoxMenuItemProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="flex-row items-center gap-x-[12px]"
        onPress={() => onChecked()}
      >
        {isChecked ? (
          <View className="size-[20px]">
            <CheckIcon width="100%" height="100%" />
          </View>
        ) : (
          <View className="size-[20px] rounded-[4px] bg-[#cdd1d5]" />
        )}
        <GlobalText className="font-pretMedium text-body-xs">
          {title}
        </GlobalText>
      </TouchableOpacity>
    </View>
  )
}

export default CheckBoxMenuItem
