import { useState } from 'react'
import Swiper from 'react-native-swiper'
import { Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import KaKaoLoginBtn from '../components/KakaoLoginBtn'
import { onboardingList } from '../constants/onboardingList'
import { loginNavigation } from '../../../navigation/types'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Login = () => {
  const navigation = useNavigation<loginNavigation>()
  const [slideTime, setSlideTime] = useState(4) // 초기 슬라이딩 시간 4초

  return (
    <View className="w-full flex-1 items-center bg-background-gray-subtle1">
      <Swiper
        autoplay
        showsPagination={false}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.65}
        autoplayTimeout={slideTime}
      >
        {onboardingList.map((onboarding, index) => {
          const Icon = onboarding.image

          return (
            <View
              key={index}
              className="mt-number-18 flex-1 items-center"
              style={{ width: SCREEN_WIDTH }}
            >
              <Text className="mb-number-8 mt-number-18 h-fit w-fit gap-number-6 rounded-radius-m1 border-border-width-static-regular border-border-gray-light bg-surface-white p-p-3 text-center text-text-subtle body-xxs">
                {onboarding.keyword}
              </Text>
              <Text className="mb-number-4 h-fit w-fit text-center heading-s">
                {onboarding.title}
              </Text>
              <Text className="mb-number-16 h-fit w-fit text-center text-text-subtle body-xs">
                {onboarding.subtitle}
              </Text>

              <View className="h-[300px] items-center justify-center rounded-radius-l">
                <Icon width={150} height={150} />
              </View>
            </View>
          )
        })}
      </Swiper>

      <View className="flex items-center justify-center">
        <KaKaoLoginBtn />
        <TouchableOpacity onPress={() => navigation.navigate('ServiceTerm')}>
          <Text className="mb-number-3 text-text-subtle label-xs">
            이용약관 확인하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text className="mb-number-21 text-text-subtle label-xs">
            개인정보처리방침 확인하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default Login
