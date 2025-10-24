import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ArrowLeft from '../../assets/icons/arrow-left.svg'

const CustomBackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <ArrowLeft />
    </TouchableOpacity>
  )
}
export default CustomBackButton
