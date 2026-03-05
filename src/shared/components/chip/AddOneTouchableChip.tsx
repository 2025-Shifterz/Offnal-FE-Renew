import { TouchableOpacity } from 'react-native'
import GlobalText from '../text/GlobalText'
import AddIcon from '../../../assets/icons/todo-add.svg'

const AddOneTouchableChip = ({
  text,
  onPress,
}: {
  text: string
  onPress: () => void
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-center gap-[5px] rounded-radius-max bg-surface-white px-[10px] py-[8px]"
    >
      <AddIcon />
      <GlobalText className="text-text-disabled-on body-xs">{text}</GlobalText>
    </TouchableOpacity>
  )
}

export default AddOneTouchableChip
