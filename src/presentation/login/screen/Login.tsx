import { useState } from 'react'
import Swiper from 'react-native-swiper'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import KaKaoLoginBtn from '../components/KakaoLoginBtn'
import { onboardingList } from '../constants/onboardingList'
import { loginNavigation } from '../../../navigation/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/GlobalText'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Login = () => {
  const navigation = useNavigation<loginNavigation>()
  const [slideTime, setSlideTime] = useState(4) // 초기 슬라이딩 시간 4초

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-background-gray-subtle1">
      <View className="flex-1">
        <Swiper
          autoplay
          showsPagination={false}
          width={SCREEN_WIDTH}
          autoplayTimeout={slideTime}
        >
          {onboardingList.map((onboarding, index) => {
            const Icon = onboarding.image

            return (
              <View
                key={index}
                className="flex-1 items-center  pt-[70px]"
                style={{ width: SCREEN_WIDTH }}
              >
                <GlobalText className="mb-number-8 h-fit w-fit gap-number-6 rounded-radius-m border-border-width-static-regular border-border-gray-light bg-surface-white p-p-3 text-center text-text-subtle body-xxs">
                  {onboarding.keyword}
                </GlobalText>
                <GlobalText className="mb-number-4 h-fit w-fit text-center heading-s">
                  {onboarding.title}
                </GlobalText>
                <GlobalText className=" h-fit w-fit text-center text-text-subtle body-xs">
                  {onboarding.subtitle}
                </GlobalText>

                <View className="flex-1 items-center justify-center rounded-radius-l  ">
                  <Icon />
                </View>
              </View>
            )
          })}
        </Swiper>
      </View>

      <View className="h-[170px] items-center ">
        <KaKaoLoginBtn />
        <TouchableOpacity onPress={() => navigation.navigate('ServiceTerm')}>
          <GlobalText className="mb-number-3 text-text-subtle label-xs">
            이용약관 확인하기
          </GlobalText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <GlobalText className="text-text-subtle label-xs">
            개인정보처리방침 확인하기
          </GlobalText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
export default Login
