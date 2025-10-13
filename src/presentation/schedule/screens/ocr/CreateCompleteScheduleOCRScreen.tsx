import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { onboardingNavigation } from '../../../../navigation/types'
import TitleMessage from '../../../../shared/components/TitleMessage'
import BottomButton from '../../../../shared/components/BottomButton'
import CompleteCalendarLottie from '../../../../assets/lottie/complete-calendar.svg'
import { SafeAreaView } from 'react-native-safe-area-context'

const CompleteCreateScheduleOCRScreen = () => {
  const navigation = useNavigation<onboardingNavigation>()
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
    >
      <View className="flex-1">
        <View className="w-full flex-1">
          <TitleMessage
            title="근무표 생성이 완료되었어요."
            subTitle="근무표가 반영된 건강 정보를 홈 화면에서 확인할 수 있어요."
          />
          <View className="mb-[50px] flex-1 items-center justify-center ">
            <CompleteCalendarLottie />
          </View>
          {/* 추후에 '완료'시 네비게이션 수정할 예정입니다. */}
          <BottomButton
            text="완료"
            onPress={() => navigation.navigate('ScheduleRegType')}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CompleteCreateScheduleOCRScreen
