import { TouchableOpacity } from 'react-native'
import ArrowLeft from '../../../assets/icons/arrow-left.svg'

const TopAppBarBackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ArrowLeft width={24} height={24} />
    </TouchableOpacity>
  )
}

export default TopAppBarBackButton
