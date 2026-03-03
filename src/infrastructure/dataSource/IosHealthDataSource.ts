import {
  getMostRecentQuantitySample,
  isHealthDataAvailable,
  queryQuantitySamples,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import { HealthDataSource } from './interface/HealthDataSource'

export class IosHealthDataSource implements HealthDataSource {
  private async ensureAuthorization(): Promise<void> {
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
  }

  async getSteps(): Promise<number> {
    await this.ensureAuthorization()
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

    return totalSteps
  }

  async getWeight(): Promise<number> {
    await this.ensureAuthorization()
    const weightData = await getMostRecentQuantitySample(
      'HKQuantityTypeIdentifierBodyMass'
    )
    const weight = weightData?.quantity ?? 0
    return weight
  }

  async getBMI(): Promise<number> {
    await this.ensureAuthorization()
    const bmiData = await getMostRecentQuantitySample(
      'HKQuantityTypeIdentifierBodyMassIndex'
    )
    const bmi = bmiData?.quantity ?? 0
    return bmi
  }
}
