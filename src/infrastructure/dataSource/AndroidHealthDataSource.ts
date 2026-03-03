import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect'
import { HealthDataSource } from './interface/HealthDataSource'

export class AndroidHealthDataSource implements HealthDataSource {
  private async ensureAuthorization(): Promise<void> {
    const isInitialized = await initialize()

    if (!isInitialized) {
      console.error('Health Connect를 사용할 수 없습니다')
      throw new Error('Health Connect is not available')
    }

    await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Weight' },
      { accessType: 'read', recordType: 'Height' },
    ])
  }

  async getSteps(): Promise<number> {
    await this.ensureAuthorization()
    const now = new Date()
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const stepsResult = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    })
    const totalSteps = stepsResult.records.reduce(
      (sum: number, record: { count?: number }) => sum + (record.count || 0),
      0
    )
    return totalSteps
  }

  async getWeight(): Promise<number> {
    await this.ensureAuthorization()
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30) // 체중 (최근 30일)

    const weightResult = await readRecords('Weight', {
      timeRangeFilter: {
        operator: 'between',
        startTime: thirtyDaysAgo.toISOString(),
        endTime: now.toISOString(),
      },
    })
    const latestWeight =
      weightResult.records.length > 0
        ? weightResult.records[weightResult.records.length - 1].weight
            .inKilograms
        : 0
    return latestWeight
  }

  /**
   * 키 데이터는 BMI 계산을 위해 필요하지만, 키 데이터를 직접 제공하지 않습니다.
   * 키 (최근 1년)
   */
  private async getHeight(): Promise<number> {
    await this.ensureAuthorization()
    const now = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const heightResult = await readRecords('Height', {
      timeRangeFilter: {
        operator: 'between',
        startTime: oneYearAgo.toISOString(),
        endTime: now.toISOString(),
      },
    })
    const latestHeight =
      heightResult.records.length > 0
        ? heightResult.records[heightResult.records.length - 1].height.inMeters
        : 0

    return latestHeight
  }

  /**
   * 안드로이드는 키와 체중 데이터를 모두 가져와서 BMI를 계산해야 합니다.
   * BMI = 체중(kg) / (키(m) * 키(m))
   */
  async getBMI(): Promise<number> {
    await this.ensureAuthorization()
    const latestWeight = await this.getWeight()
    const latestHeight = await this.getHeight()

    let bmi = 0
    if (latestWeight > 0 && latestHeight > 0) {
      bmi = latestWeight / (latestHeight * latestHeight)
    }
    return bmi
  }
}
