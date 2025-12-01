import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { rootNavigation } from '../../navigation/types'
import LottieView from 'lottie-react-native'
import { useAuthStore } from '../../store/useAuthStore'

const SplashScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  const handleAnimationFinish = async () => {
    try {
      const session = await isLoggedIn()
      const targetRoute = session ? 'Tabs' : 'LoginScreens'
      console.log('Navigating to:', targetRoute)
      navigation.reset({
        index: 0,
        routes: [{ name: targetRoute }],
      })
    } catch (error) {
      console.error('Token 확인 중 오류 또는 타임아웃 발생:', error)
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreens' }],
      })
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-surface-primary">
      <LottieView
        source={require('../../assets/lottie/SplashScreen.json')}
        autoPlay
        loop={false}
        resizeMode="contain"
        style={{ width: 250, height: 250 }}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  )
}

export default SplashScreen
