import React, { useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import SelectScheduleBox from '../component/SelectScheduleBox'
import BottomButton from '../../common/component/BottomButton'
import TitleMessage from '../../common/component/TitleMessage'
import { useNavigation } from '@react-navigation/native'
import { onboardingNavigation } from '../../../navigation/types'

const ScheduleRegType = () => {
  const navigation = useNavigation<onboardingNavigation>()
  const [selectedBoxId, setSelectedBoxId] = useState<number>(1)

  // 이 함수는 클릭된 박스의 id를 받아서 상태를 업데이트.
  const handleBoxClick = (id: number) => {
    setSelectedBoxId(id)
    console.log(`Selected Box ID: ${id}`)
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <View className="w-full flex-1">
          <TitleMessage
            title="근무표 등록 방식을 선택해주세요."
            subTitle={`전체 근무표를 등록해 여러 조의 스케쥴을 확인하거나,\n내 근무조만 등록해 간편하게 일상을 관리할 수 있어요.`}
          />
          <View className="mt-[26px] flex flex-row gap-3">
            <SelectScheduleBox
              id={1}
              onPress={handleBoxClick}
              isSelected={selectedBoxId === 1}
              title="전체 근무표 등록"
              subTitle={`여러 조의 스케줄이 담긴\n근무표를 등록할 수 있어요`}
            />
            <SelectScheduleBox
              id={2}
              onPress={handleBoxClick}
              isSelected={selectedBoxId === 2}
              title="내 근무표만 등록"
              subTitle={`내가 속한 조의 스케줄만\n간편하게 등록해요`}
            />
          </View>
          <BottomButton
            text="다음"
            onPress={() => {
              navigation.navigate('ScheduleInfoInput', { selectedBoxId })
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ScheduleRegType
