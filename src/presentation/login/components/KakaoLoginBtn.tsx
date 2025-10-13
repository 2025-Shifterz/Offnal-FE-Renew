import { Text, TouchableOpacity } from 'react-native'
import KakaoLogo from '../../../assets/icons/kakao_logo.svg'

import { useNavigation } from '@react-navigation/native'
import { loginNavigation } from '../../../navigation/types'

const KaKaoLoginBtn = () => {
  const navigation = useNavigation<loginNavigation>()

  const handleKakaoLogin = async () => {
    navigation.navigate('KakaoWebView')
  }

  return (
    <TouchableOpacity
      onPress={handleKakaoLogin}
      className="mx-gap-5 w-fill mb-number-8 h-12 flex-row items-center justify-center rounded-radius-m1 bg-kakao-bg pl-[14px] pr-[14px]"
    >
      <KakaoLogo />
      <Text className="px-[86px] text-kakao-text heading-xxs">
        카카오 로그인
      </Text>
    </TouchableOpacity>
  )
}
export default KaKaoLoginBtn
