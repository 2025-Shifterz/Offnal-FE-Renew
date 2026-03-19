import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../navigation/types/StackTypes'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import HeadLineText from '../../../shared/components/text/HeadLineText'
import { SafeAreaView } from 'react-native-safe-area-context'
import CompleteCalendarLottie from '../../../assets/lottie/complete-calendar.svg'
import EmphasizedButton from '../../../shared/components/button/Button'
import GlobalText from '../../../shared/components/text/GlobalText'

const CompleteScheduleScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-p-7"
    >
      <View className="w-full flex-1 ">
        <HeadLineText
          heading="근무표 생성이 완료되었어요."
          description="근무표가 반영된 건강 정보를 홈 화면에서 확인할 수 있어요."
        />
        <View className="mb-[50px] flex-1 items-center justify-center ">
          <CompleteCalendarLottie />
        </View>

        <EmphasizedButton
          content={
            <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
              완료
            </GlobalText>
          }
          onPress={() => navigation.navigate('Tabs')}
        />
      </View>
    </SafeAreaView>
  )
}

export default CompleteScheduleScreen
