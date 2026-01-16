import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ArrowLeft from '../../assets/icons/arrow-left.svg'

const CustomBackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <ArrowLeft />
    </TouchableOpacity>
  )
}
export default CustomBackButton
