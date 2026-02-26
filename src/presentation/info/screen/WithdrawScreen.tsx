import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Alert, View } from 'react-native'
import BottomButton from '../../../shared/components/BottomButton'
import GlobalText from '../../../shared/components/GlobalText'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { memberRepository } from '../../../infrastructure/di/Dependencies'
import { useResetAllStore } from '../../../shared/hooks/useResetAllStore'

const WithdrawScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const [isLoading, setIsLoading] = useState(false)
  const { resetAll } = useResetAllStore()

  const handleWithdraw = async () => {
    setIsLoading(true)

    try {
      await memberRepository.withDrawMember()
      await resetAll()

      Alert.alert('알림', '회원 탈퇴가 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreens' }],
              })
            )
          },
          style: 'destructive',
        },
      ])
    } catch {
      Alert.alert('오류', '회원 탈퇴에 실패했습니다.\n다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <View className="flex-1">
          <View className="flex-1 gap-y-[12px] px-number-9 py-[14px]">
            <GlobalText className="font-pretSemiBold text-heading-m">
              탈퇴하기 전에 확인해주세요
            </GlobalText>
            {[
              '회원 탈퇴 시 모든 개인정보와 활동 기록이 영구적으로 삭제되며, 복구할 수 없습니다.',
              '삭제되는 정보: 프로필 정보, 근무표 정보, 할 일 및 메모 등',
              '단, 관련 법령에 따라 일부 정보는 일정 기간 보관될 수 있습니다.',
            ].map(text => (
              <View key={text} className="flex-row items-start">
                <GlobalText className="mr-[4px] font-pretRegular text-label-xs">
                  {'\u2022'}
                </GlobalText>
                <GlobalText className="flex-1 font-pretRegular text-label-xs">
                  {text}
                </GlobalText>
              </View>
            ))}
          </View>

          <BottomButton
            text="탈퇴할게요"
            onPress={() => handleWithdraw()}
            className="px-number-8"
          />
        </View>
      </SafeAreaView>
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-50">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  )
}

export default WithdrawScreen
