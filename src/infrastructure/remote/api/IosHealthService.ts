import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  queryQuantitySamples,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import { Alert } from 'react-native'
import { HealthData } from '../../../shared/types/Health'

export class IosHealthService {
  getIosHealthService = async (): Promise<HealthData> => {
    // 1. HealthKit 사용 가능 여부 확인
    const isAvailable = await isHealthDataAvailable()
    if (!isAvailable) {
      Alert.alert('오류', 'HealthKit을 사용할 수 없습니다')
      return {
        steps: 0,
        weight: 0,
        bmi: 0,
      }
    }

    // 2. 권한 요청 - 읽기 전용
    await requestAuthorization(
      [],
      [
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierBodyMass',
        'HKQuantityTypeIdentifierBodyMassIndex',
      ]
    )

    // 3. 건강 데이터 가져오기
    const stepData = await queryQuantitySamples(
      'HKQuantityTypeIdentifierStepCount'
    )
    const totalSteps =
      stepData?.reduce((sum, sample) => sum + sample.quantity, 0) ?? 0

    // 체중 가져오기
    const weightData = await getMostRecentQuantitySample(
      'HKQuantityTypeIdentifierBodyMass'
    )
    const weight = weightData?.quantity ?? 0

    // BMI 가져오기
    const bmiData = await getMostRecentQuantitySample(
      'HKQuantityTypeIdentifierBodyMassIndex'
    )
    const bmi = bmiData?.quantity ?? 0

    console.log('ios Health Data :', { totalSteps, weight, bmi })

    return {
      steps: Math.round(totalSteps),
      weight: Math.round(weight),
      bmi: Math.round(bmi),
    }
  }
}
