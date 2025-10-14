import React, { useState } from 'react'
import { View } from 'react-native'
import SelectScheduleBox from '../../component/SelectScheduleBox'
import { useNavigation } from '@react-navigation/native'
import { onboardingNavigation } from '../../../../navigation/types'
import TitleMessage from '../../../../shared/components/TitleMessage'
import BottomButton from '../../../../shared/components/BottomButton'
import { ScheduleType } from '../../../../shared/types/ScheduleScopeType'
import { SafeAreaView } from 'react-native-safe-area-context'

const SelectScheduleScopeOCRScreen = () => {
  const navigation = useNavigation<onboardingNavigation>()
  const [selectedScheduleType, setSelectedScheduleType] =
    useState<ScheduleType>('ALL')

  // 이 함수는 클릭된 박스의 type을 받아서 상태를 업데이트.
  const handleBoxClick = (type: ScheduleType) => {
    setSelectedScheduleType(type)
    console.log(`Selected Box Type: ${type}`)
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-[16px]"
    >
      <View className="flex-1">
        <View className="w-full flex-1">
          <TitleMessage
            title="근무표 등록 방식을 선택해주세요."
            subTitle={`전체 근무표를 등록해 여러 조의 스케쥴을 확인하거나,\n내 근무조만 등록해 간편하게 일상을 관리할 수 있어요.`}
          />
          <View className="mt-[26px] flex flex-row gap-3">
            <SelectScheduleBox
              type="ALL"
              onPress={handleBoxClick}
              isSelected={selectedScheduleType === 'ALL'}
              title="전체 근무표 등록"
              subTitle={`여러 조의 스케줄이 담긴\n근무표를 등록할 수 있어요`}
            />
            <SelectScheduleBox
              type="MY"
              onPress={handleBoxClick}
              isSelected={selectedScheduleType === 'MY'}
              title="내 근무표만 등록"
              subTitle={`내가 속한 조의 스케줄만\n간편하게 등록해요`}
            />
          </View>
          <BottomButton
            text="다음"
            onPress={() => {
              navigation.navigate('ScheduleInfoInput', { selectedScheduleType })
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SelectScheduleScopeOCRScreen
