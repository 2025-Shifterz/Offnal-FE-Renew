import { View } from 'react-native'
import TopAppBar from '../../../shared/components/TopAppBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InfoStackParamList } from '../../../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

const WithdrawScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<InfoStackParamList>>()

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="회원 탈퇴"
          showBackButton={true}
          onPressBackButton={() => navigation.goBack()}
        />
      </SafeAreaView>
    </View>
  )
}

export default WithdrawScreen
