import { useState } from 'react'
import Swiper from 'react-native-swiper'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native'
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native'
import KaKaoLoginBtn from '../components/KakaoLoginBtn'
import { onboardingList } from '../constants/OnboardingList'
import {
  loginNavigation,
  rootNavigation,
} from '../../../navigation/types/StackTypes'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/text/GlobalText'
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@env'
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication'
import { useAuthStore } from '../../../store/useAuthStore'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type LoginScreenNavigationProp = CompositeNavigationProp<
  loginNavigation,
  rootNavigation
>

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const [slideTime] = useState(4)
  const loginWithApple = useAuthStore(state => state.loginWithApple)
  const loginWithKakao = useAuthStore(state => state.loginWithKakao)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)

  const navigateAfterSocialLogin = (isNewMember: boolean) => {
    navigation.getParent<rootNavigation>()?.reset({
      index: 0,
      routes: isNewMember
        ? [
            {
              name: 'OnboardingMethodScreen',
              params: { createScheduleButtonClick: false },
            },
          ]
        : [{ name: 'Tabs' }],
    })
  }

  const isKakaoLoginCancelled = (error: unknown) => {
    if (!error || typeof error !== 'object') return false

    return (
      'code' in error &&
      (error as { code?: string }).code === 'E_CANCELLED_OPERATION'
    )
  }

  const getKakaoLoginErrorMessage = (error: unknown) => {
    if (!error || typeof error !== 'object') {
      return '카카오 로그인에 실패했습니다. 다시 시도해주세요.'
    }

    const kakaoError = error as {
      error_code?: string
      error_description?: string
      message?: string
    }

    if (kakaoError.error_code === 'KOE009') {
      return 'Android keyHash 검증에 실패했습니다. Kakao Developers에 등록된 keyHash를 확인해주세요.'
    }

    return (
      kakaoError.error_description ??
      kakaoError.message ??
      '카카오 로그인에 실패했습니다. 다시 시도해주세요.'
    )
  }

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
        <KaKaoLoginBtn
          loading={isKakaoLoading}
          onPress={async () => {
            try {
              setIsKakaoLoading(true)
              const isNewMember = await loginWithKakao()
              setIsKakaoLoading(false)
              navigateAfterSocialLogin(isNewMember)
            } catch (error: unknown) {
              setIsKakaoLoading(false)

              if (isKakaoLoginCancelled(error)) {
                return
              }

              Alert.alert('로그인 실패', getKakaoLoginErrorMessage(error))
            }
          }}
        />

        {Platform.OS === 'ios' && (
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{ width: 300, height: 45 }}
            onPress={async () => {
              try {
                const isNewMember = await loginWithApple()
                navigateAfterSocialLogin(isNewMember)
              } catch (error: unknown) {
                if (
                  typeof error === 'object' &&
                  error !== null &&
                  'code' in error &&
                  (error as { code?: string }).code === appleAuth.Error.CANCELED
                ) {
                  return
                }

                Alert.alert(
                  '로그인 실패',
                  '로그인에 실패했습니다. 다시 시도해주세요.'
                )
              }
            }}
          />
        )}

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
