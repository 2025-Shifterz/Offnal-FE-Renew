import React from 'react'
import { View } from 'react-native'
import SelectScheduleBox from '../component/SelectScheduleBox'
import { useNavigation } from '@react-navigation/native'
import HeadLineText from '../../../shared/components/text/HeadLineText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScheduleScope } from '../../../shared/types/ScheduleScope'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import goNextOnboadingScreen from '../flow/goNextOnboardingScreen'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { OnboardingRoute } from '../../../navigation/types/OnboardingRoute'
import { useShallow } from 'zustand/shallow'
import GlobalText from '../../../shared/components/text/GlobalText'
import EmphasizedButton from '../../../shared/components/button/Button'

const SelectScheduleScopeScreen = () => {
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()

  const { onboardingMethod, scheduleScope, setScheduleScope } =
    useOnboardingStore(
      useShallow(state => ({
        onboardingMethod: state.onboardingMethod,
        scheduleScope: state.scheduleScope,
        setScheduleScope: state.setScheduleScope,
      }))
    )

  // 이 함수는 클릭된 박스의 type을 받아서 상태를 업데이트.
  const handleBoxClick = (type: ScheduleScope) => {
    setScheduleScope(type)
  }

  const handleNext = () => {
    const nextStep = goNextOnboadingScreen(
      onboardingMethod,
      OnboardingStep.SelectScheduleScope
    )
    navigation.navigate({ name: nextStep } as OnboardingRoute)
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-background-gray-subtle1 px-p-7"
    >
      <View className="w-full flex-1">
        <HeadLineText
          heading="근무표 등록 방식을 선택해주세요."
          description={`전체 근무표를 등록해 여러 조의 스케쥴을 확인하거나,\n내 근무조만 등록해 간편하게 일상을 관리할 수 있어요.`}
        />
        <View className="mt-[26px] flex flex-row gap-3">
          <SelectScheduleBox
            type="ALL"
            onPress={handleBoxClick}
            isSelected={scheduleScope === 'ALL'}
            title="전체 근무표 등록"
            subTitle={`여러 조의 스케줄이 담긴\n근무표를 등록할 수 있어요`}
          />
          <SelectScheduleBox
            type="MY"
            onPress={handleBoxClick}
            isSelected={scheduleScope === 'MY'}
            title="내 근무표만 등록"
            subTitle={`내가 속한 조의 스케줄만\n간편하게 등록해요`}
          />
        </View>
      </View>

      <EmphasizedButton
        content={
          <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
            다음
          </GlobalText>
        }
        onPress={handleNext}
      />
    </SafeAreaView>
  )
}

export default SelectScheduleScopeScreen
