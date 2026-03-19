import { Pressable, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import EditIcon from '../../../assets/icons/file-edit-02.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

interface AlarmEditDropdownProps {
  visible: boolean
  onClose: () => void
  onEditPress: () => void
}

const AlarmEditDropdown = ({
  visible,
  onClose,
  onEditPress,
}: AlarmEditDropdownProps) => {
  const insets = useSafeAreaInsets()

  if (!visible) {
    return null
  }

  const topOffset = Math.max(80, insets.top + 50)

  return (
    <View className="absolute inset-0 z-20">
      <Pressable className="flex-1" onPress={onClose}>
        <View
          className="absolute right-[15.5px] rounded-[10px] bg-surface-disabled px-[12px] py-[10px]"
          style={{ top: topOffset }}
        >
          <TouchableOpacity
            className="flex-row items-center gap-[12px]"
            onPress={onEditPress}
          >
            <EditIcon width={16} height={16} />
            <GlobalText className="font-pretMedium text-text-disabled body-xs">
              편집하기
            </GlobalText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  )
}

export default AlarmEditDropdown
