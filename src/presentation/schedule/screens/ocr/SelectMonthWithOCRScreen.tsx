import React, { useCallback, useState } from 'react'
import { View, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MonthPicker } from '../../component/MonthPicker'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {
  onboardingNavigation,
  OnboardingStackParamList,
} from '../../../../navigation/types'
import TitleMessage from '../../../../shared/components/TitleMessage'
import BottomButton from '../../../../shared/components/BottomButton'

type ScheduleTypeRouteProp = RouteProp<
  OnboardingStackParamList,
  'SelectMonthWithOCR'
>

const SelectMonthWithOCRScreen = () => {
  const route = useRoute<ScheduleTypeRouteProp>()
  const navigation = useNavigation<onboardingNavigation>()

  const { selectedScheduleScopeType, calendarName, workGroup, workTimes } =
    route.params
  console.log('SelectMonthWithOCRScreen params:', route.params)

  const [date, setDate] = useState<{ year: number; month: number | null }>({
    year: new Date().getFullYear(),
    month: null,
  })

  const handleDateChange = useCallback((year: number, month: number | null) => {
    setDate({ year, month })
  }, [])

  const handleNext = () => {
    if (date.month) {
      navigation.navigate('SelectPhotoOCR', {
        year: date.year,
        month: date.month,
        selectedScheduleScopeType,
        calendarName,
        workGroup,
        workTimes,
      })
    } else {
      Alert.alert(
        '월을 선택해주세요',
        '근무 월을 선택하지 않으면 다음 단계로 넘어갈 수 없습니다.',
        [{ text: '확인', onPress: () => {} }]
      )
    }
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-number-8">
      <SafeAreaView edges={['bottom']} className="flex-1">
        <View className="flex-1 gap-[20px]">
          <TitleMessage
            title={`이미지에 해당하는 근무 월을\n선택해주세요.`}
            subTitle={`AI 인식을 위해 등록할 이미지가\n어떤 월의 근무표인지 알려주세요.`}
          />

          <MonthPicker onDateChange={handleDateChange} />

          <BottomButton text="다음" onPress={handleNext} />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default SelectMonthWithOCRScreen
