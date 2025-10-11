import { StyleSheet, Text, View } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../../navigation/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import LottieView from 'lottie-react-native'

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handleAnimationFinish = async () => {
    try {
      const token = await EncryptedStorage.getItem('accessToken')
      const targetRoute = token ? 'Tabs' : 'LoginScreens'

      navigation.reset({
        index: 0,
        routes: [{ name: targetRoute }],
      })
    } catch (error) {
      console.error('Token 확인 중 오류 발생:', error)
    }
  }

  return (
    <SafeAreaView className="relative flex-1">
      <LinearGradient
        colors={['#5cc0cd', '#eee8ac']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="mt-[85%] flex-1 items-center">
        <LottieView
          source={require('../../../assets/lottie/SplashScreen.json')}
          autoPlay
          loop={false}
          resizeMode="contain"
          style={{ width: 250, height: 250 }}
          onAnimationFinish={handleAnimationFinish}
        />
        <Text className="mt-number-2 text-center text-white heading-xs">
          더 나은 오프날을 위한{'\n'}종합 교대근무 루틴 매니저
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen
