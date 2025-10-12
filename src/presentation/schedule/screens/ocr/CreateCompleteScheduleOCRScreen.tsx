import React from 'react'
import { SafeAreaView, View } from 'react-native'
import BottomButton from '../../../common/component/BottomButton'
import TitleMessage from '../../../common/component/TitleMessage'
import { useNavigation } from '@react-navigation/native'
import { onboardingNavigation } from '../../../../navigation/types'

const CompleteCreateScheduleOCRScreen = () => {
  const navigation = useNavigation<onboardingNavigation>()
  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <View className="w-full flex-1">
          <TitleMessage
            title="근무표 생성이 완료되었어요."
            subTitle="근무표가 반영된 건강 정보를 홈 화면에서 확인할 수 있어요."
          />
          {/* 추후에 '완료'시 네비게이션 수정할 예정입니다. */}
          <BottomButton
            text="완료"
            onPress={() => navigation.navigate('ScheduleRegType')}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default CompleteCreateScheduleOCRScreen
