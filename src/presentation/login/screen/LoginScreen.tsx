import { useState } from 'react'
import Swiper from 'react-native-swiper'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import KaKaoLoginBtn from '../components/KakaoLoginBtn'
import { onboardingList } from '../constants/OnboardingList'
import { loginNavigation } from '../../../navigation/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/GlobalText'
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@env'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const LoginScreen = () => {
  const navigation = useNavigation<loginNavigation>()
  const [slideTime] = useState(4)

  return (
    <SafeAreaView className="w-full flex-1 items-center bg-background-white">
      <View className="mt-[67px] flex-1 items-center">
        <Swiper
          autoplay
          showsPagination={true}
          width={SCREEN_WIDTH}
          autoplayTimeout={slideTime}
          paginationStyle={{ bottom: 60 }}
        >
          {onboardingList.map((onboarding, index) => {
            const Icon = onboarding.image

            return (
              <View
                key={index}
                className="flex-1 items-center justify-center pb-[60px]"
              >
                <GlobalText className="mb-number-4 text-center font-pretSemiBold text-heading-m">
                  {onboarding.title
                    .split(onboarding.highlight)
                    .map((part, i, arr) => (
                      <GlobalText
                        key={i}
                        className="font-pretSemiBold text-heading-m"
                      >
                        {part}
                        {i < arr.length - 1 && (
                          <GlobalText className="font-pretSemiBold text-heading-m text-text-primary">
                            {onboarding.highlight}
                          </GlobalText>
                        )}
                      </GlobalText>
                    ))}
                </GlobalText>

                <View className="flex-1 items-center justify-center rounded-radius-l">
                  <Icon />
                </View>

                <GlobalText className="mb-[80px] text-center text-body-xs text-text-subtle">
                  {onboarding.subtitle}
                </GlobalText>
              </View>
            )
          })}
        </Swiper>
      </View>

      <View className="mt-[15px] flex-col items-center">
        <KaKaoLoginBtn />
        {/* <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: 160,
            height: 45,
          }}
          onPress={() => onAppleButtonPress()}
        /> */}

        <View className="mt-[16px] flex-row justify-center">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsWebViewScreen', {
                url: TERMS_OF_USE_URL,
                title: '이용 약관',
              })
            }}
          >
            <GlobalText className="mb-number-3 text-label-xxs text-text-subtle underline">
              이용약관
            </GlobalText>
          </TouchableOpacity>
          <GlobalText className="text-label-xxs text-text-disabled">
            &nbsp;및&nbsp;
          </GlobalText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsWebViewScreen', {
                url: PRIVACY_POLICY_URL,
                title: '개인정보처리방침',
              })
            }}
          >
            <GlobalText className="text-label-xxs text-text-subtle underline">
              개인정보 처리 방침 확인
            </GlobalText>
          </TouchableOpacity>
          <GlobalText className="text-label-xxs text-text-disabled">
            &nbsp;후 동의합니다.
          </GlobalText>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default LoginScreen
