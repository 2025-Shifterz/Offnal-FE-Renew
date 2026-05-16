import { TouchableOpacity } from 'react-native'
import PlusIcon from '../../../assets/icons/w-plus.svg'

const CalendarFloatingActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-[13px] right-[13px] h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-surface-inverse"
    >
      <PlusIcon />
    </TouchableOpacity>
  )
}

export default CalendarFloatingActionButton
