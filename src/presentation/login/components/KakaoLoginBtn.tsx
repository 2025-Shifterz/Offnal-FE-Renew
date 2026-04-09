import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import KakaoLogo from '../../../assets/icons/kakao_logo.svg'
type KaKaoLoginBtnProps = {
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

const KaKaoLoginBtn = ({
  onPress,
  loading = false,
  disabled = false,
}: KaKaoLoginBtnProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className="mb-number-8 h-12 w-[300px] flex-row items-center justify-center rounded-radius-xs bg-kakao-bg px-[14px]"
    >
      <KakaoLogo />
      <View className="px-[86px]">
        {loading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text className="text-kakao-text heading-xxs">카카오 로그인</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
export default KaKaoLoginBtn
