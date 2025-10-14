import { View } from 'react-native'
import Camera from '../../../assets/icons/camera.svg'
import CalendarYellow from '../../../assets/icons/calendar_yellow.svg'
import CalendarBlue from '../../../assets/icons/calendar_blue.svg'
import RegMethod from '../component/RegMethod'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/GlobalText'
import { useState } from 'react'
import BottomButton from '../../../shared/components/BottomButton'
import { ScheduleRegMethod } from '../../../shared/types/ScheduleRegMethod'

const SelectScheduleRegScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [selectedScheduleRegMethod, setSelectedScheduleRegMethod] =
    useState<ScheduleRegMethod>('OCR')

  // 이 함수는 클릭된 박스의 id를 받아서 상태를 업데이트.
  const handleBoxClick = (type: ScheduleRegMethod) => {
    setSelectedScheduleRegMethod(type)
    console.log(`선택된 근무표 등록 방법: ${type}`)
  }
  return (
    <SafeAreaView className="h-full w-full flex-1 bg-background-gray-subtle1 px-p-7">
      <View className="flex-1">
        <View className="mb-[4px] h-[50px]" />
        <GlobalText className="text-text-bolder heading-m">
          오프날에 오신걸 환영해요!{`\n`}근무표를 어떤 방법으로 입력할까요?
        </GlobalText>
        <GlobalText className="mb-number-9 pt-number-7 text-text-subtle label-xs">
          회사 근무표 검색 기능은 추후 추가될 예정이에요.
        </GlobalText>

        <RegMethod
          type="OCR"
          isSelected={selectedScheduleRegMethod === 'OCR'}
          Icon={Camera}
          title="근무표 사진 찍어서 자동 등록하기"
          subtitle="AI로 근무표를 자동 등록해요"
          onPress={handleBoxClick}
          // onPress={() => navigation.navigate('OnboardingSchedulesWithOCR')}
        />

        <RegMethod
          type="NEW"
          isSelected={selectedScheduleRegMethod === 'NEW'}
          Icon={CalendarYellow}
          title="근무표 새로 만들기"
          subtitle="지금 바로 직접 근무표를 만들고 시작해요"
          onPress={handleBoxClick}
          // onPress={() => navigation.navigate('OnboardingSchedules')}
        />

        <RegMethod
          type="DIRECT"
          isSelected={selectedScheduleRegMethod === 'DIRECT'}
          Icon={CalendarBlue}
          title="근무표 없이 시작하기"
          subtitle="지금은 근무표 없이 시작하고, 나중에 등록할 수 있어요"
          onPress={handleBoxClick}
          // onPress={() => navigation.navigate('Tabs')}
        />
        <BottomButton
          text="다음"
          onPress={
            selectedScheduleRegMethod === 'OCR'
              ? () => navigation.navigate('OnboardingSchedulesWithOCR')
              : selectedScheduleRegMethod === 'NEW'
                ? () => navigation.navigate('OnboardingSchedules')
                : () => navigation.navigate('Tabs')
          }
        />
      </View>
    </SafeAreaView>
  )
}

export default SelectScheduleRegScreen
