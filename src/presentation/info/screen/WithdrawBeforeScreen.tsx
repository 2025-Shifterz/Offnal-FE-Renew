import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/appbar/TopAppBar'
import BottomButton from '../../../shared/components/BottomButton'
import GlobalText from '../../../shared/components/GlobalText'
import CheckBoxMenuItem from '../component/CheckBoxMenuItem'
import CheckBoxWithTextInput from '../component/CheckBoxWithTextInput'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

const WithdrawBeforeScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const [checkedState, setCheckedState] = useState({
    no_longer_used: false,
    error: false,
    uncomfortable: false,
    new_account: false,
    other: false,
  })
  const [otherReason, setOtherReason] = useState('')

  const handleCheck = (key: keyof typeof checkedState) => {
    if (key === 'other' && checkedState.other) {
      setOtherReason('')
    }

    setCheckedState(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  const isAnyChecked = Object.values(checkedState).some(status => status)

  const handleNavigate = () => {
    if (isAnyChecked) {
      navigation.navigate('WithdrawScreen')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-surface-gray-subtle1">
        <SafeAreaView className="flex-1 " edges={['top', 'bottom']}>
          <TopAppBar
            title="회원 탈퇴"
            showBackButton={true}
            onPressBackButton={() => {
              navigation.pop()
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <View className="flex-1 px-number-9">
              <View className="mb-[32px] flex-col">
                <GlobalText className="mb-[12px] font-pretSemiBold text-heading-m">
                  탈퇴하기 전에 확인해주세요
                </GlobalText>
                <GlobalText className="font-pretRegular text-label-xs">
                  계정을 삭제하는 이유를 알려주시면,
                </GlobalText>
                <GlobalText className="font-pretRegular text-label-xs">
                  앞으로 더 나은 서비스를 제공하기 위해 노력하겠습니다.
                </GlobalText>
                <GlobalText className="font-pretRegular text-label-xs">
                  (중복 선택 가능)
                </GlobalText>
              </View>

              <View className="flex-col gap-y-[20px]">
                <CheckBoxMenuItem
                  title="사용하지 않는 앱이에요."
                  isChecked={checkedState.no_longer_used}
                  onChecked={() => handleCheck('no_longer_used')}
                />
                <CheckBoxMenuItem
                  title="오류가 생겨 사용할 수 없는 없어요."
                  isChecked={checkedState.error}
                  onChecked={() => handleCheck('error')}
                />
                <CheckBoxMenuItem
                  title="앱 사용이 불편해요."
                  isChecked={checkedState.uncomfortable}
                  onChecked={() => handleCheck('uncomfortable')}
                />
                <CheckBoxMenuItem
                  title="새로운 계정을 만들고 싶어요."
                  isChecked={checkedState.new_account}
                  onChecked={() => handleCheck('new_account')}
                />
                <CheckBoxWithTextInput
                  title="기타"
                  isChecked={checkedState.other}
                  onChecked={() => handleCheck('other')}
                  content={otherReason}
                  onContentChange={setOtherReason}
                />
              </View>
            </View>

            <BottomButton
              text="탈퇴하기"
              onPress={handleNavigate}
              className="px-number-8"
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default WithdrawBeforeScreen
