import { View, Text, TouchableOpacity } from 'react-native'
import ArrowBack from '../../../assets/icons/arrow_left.svg'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types'

type AlarmHeaderProps = {
  headerText: string
}

const AlarmHeaderNoList = ({ headerText }: AlarmHeaderProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View className="relative h-[50px] w-full items-center justify-center">
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={navigation.goBack}
        className="absolute left-number-8 h-6 w-6 items-center justify-center"
      >
        <ArrowBack width={24} height={24} />
      </TouchableOpacity>

      {/* 가운데 텍스트 */}
      <Text className="text-text-basic heading-xs">{headerText}</Text>
    </View>
  )
}

export default AlarmHeaderNoList
