import { TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../../shared/components/text/GlobalText'

interface TodoOptionItemProps {
  icon: React.ReactNode
  title: string
  onPress: () => void
}

const TodoOptionItem = ({ icon, title, onPress }: TodoOptionItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-3">
      <View className="h-[30px] w-[30px] items-center justify-center rounded-lg bg-surface-gray-subtle1">
        {icon}
      </View>
      <GlobalText className="ml-[12px] text-heading-xxs">{title}</GlobalText>
    </TouchableOpacity>
  )
}

export default TodoOptionItem
