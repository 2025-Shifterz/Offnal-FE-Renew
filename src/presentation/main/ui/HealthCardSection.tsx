import { Alert, View } from 'react-native'
import TitleSection from '../components/TitleSection'
import HealthCard from '../components/HealthCard'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_24.svg'

// Apple Health Kit 연동
import {
  isHealthDataAvailable,
  requestAuthorization,
  getMostRecentQuantitySample,
  queryQuantitySamples,
} from '@kingstinct/react-native-healthkit'

import { useCallback, useEffect, useState } from 'react'

const HealthCardSection = () => {
  const [steps, setSteps] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)

  const fetchHealthData = useCallback(async () => {
    try {
      // 오늘의 걸음 수 가져오기
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const stepData = await queryQuantitySamples(
        'HKQuantityTypeIdentifierStepCount'
      )

      if (stepData && stepData.length > 0) {
        const totalSteps = stepData.reduce(
          (sum, sample) => sum + sample.quantity,
          0
        )
        setSteps(Math.round(totalSteps))
        console.log('오늘의 걸음 수:', totalSteps)
      } else {
        console.log('걸음 수 데이터 없음')
      }

      // 최신 체중 가져오기
      const weightData = await getMostRecentQuantitySample(
        'HKQuantityTypeIdentifierBodyMass'
      )

      if (weightData) {
        setWeight(Math.round(weightData.quantity))
        console.log('현재 체중:', weightData.quantity, weightData.unit)
      } else {
        console.log('체중 데이터 없음')
      }
    } catch (error) {
      console.error('데이터 가져오기 실패:', error)
    }
  }, [])

  const initHealthKit = useCallback(async () => {
    try {
      // 1. HealthKit 사용 가능 여부 확인
      const isAvailable = await isHealthDataAvailable()

      if (!isAvailable) {
        Alert.alert('오류', 'HealthKit을 사용할 수 없습니다')
        return
      }

      // 2. 권한 요청 (읽기 전용)
      await requestAuthorization(
        [], // 쓰기 권한 없음
        [
          'HKQuantityTypeIdentifierStepCount',
          'HKQuantityTypeIdentifierBodyMass',
        ] // 읽기 권한
      )

      console.log('HealthKit 권한 승인 완료 👍')

      // 3. 데이터 가져오기
      await fetchHealthData()
    } catch (error) {
      console.error('HealthKit 초기화 실패:', error)
      Alert.alert('오류', `HealthKit 오류: ${error}`)
    }
  }, [fetchHealthData])

  useEffect(() => {
    initHealthKit()
  }, [initHealthKit])

  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.WithAddableBtn
        title="건강 카드"
        btnContent="건강 카드 추가"
        onPressIcon={() => {}}
      />
      <View className="w-full flex-row items-center gap-g-3 pb-number-8 pt-number-6">
        <HealthCard
          title="걸음 수"
          value={steps}
          unit={9000}
          Icon={SneakersIcon}
          secondaryUnit="64%"
        />
        <HealthCard
          title="체중"
          value={weight}
          Icon={WeightIcon}
          secondaryUnit="표준"
        />
      </View>
    </View>
  )
}

export default HealthCardSection
