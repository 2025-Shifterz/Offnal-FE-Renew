import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  queryQuantitySamples,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import { HealthData } from '../../shared/types/Health'
import { STEP_GOAL } from '../../presentation/main/constants/stepGoal'
import { HealthRepository } from '../../domain/repositories/HealthRepository'

export class IosHealthDataSource implements HealthRepository {
  getHealthData = async (): Promise<HealthData> => {
    try {
      const isAvailable = await isHealthDataAvailable()
      if (!isAvailable) {
        console.error('오류', 'HealthKit을 사용할 수 없습니다')
        throw new Error('HealthKit is not available')
      }

      // 권한 요청 - 읽기 전용
      await requestAuthorization(
        [],
        [
          'HKQuantityTypeIdentifierStepCount',
          'HKQuantityTypeIdentifierBodyMass',
          'HKQuantityTypeIdentifierBodyMassIndex',
        ]
      )

      const now = new Date()
      const todayStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      ) // 오늘 시작 시간
      const todayEndDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      ) // 오늘 끝 시간

      const stepData = await queryQuantitySamples(
        'HKQuantityTypeIdentifierStepCount',
        {
          filter: {
            startDate: todayStartDate,
            endDate: todayEndDate,
          },
        }
      )

      const totalSteps =
        stepData?.reduce((sum, sample) => sum + sample.quantity, 0) ?? 0

      const weightData = await getMostRecentQuantitySample(
        'HKQuantityTypeIdentifierBodyMass'
      )
      const weight = weightData?.quantity ?? 0

      const bmiData = await getMostRecentQuantitySample(
        'HKQuantityTypeIdentifierBodyMassIndex'
      )
      const bmi = bmiData?.quantity ?? 0

      // 걸음 수 % 계산 (9000걸음 목표 대비)
      const stepPercentage = (totalSteps / STEP_GOAL) * 100

      return {
        steps: totalSteps,
        weight: Math.round(weight * 10) / 10,
        bmi: Math.round(bmi * 10) / 10,
        stepPercentage: Math.round(stepPercentage * 10) / 10,
      }
    } catch (error) {
      console.error('iOS 헬스 데이터 가져오기 오류:', error)
      throw error
    }
  }
}
