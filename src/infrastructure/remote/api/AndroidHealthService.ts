import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect'
import { HealthData } from '../../../shared/types/Health'

export class AndroidHealthService {
  getAndroidHealthService = async (): Promise<HealthData> => {
    try {
      // initialize the client
      const isInitialized = await initialize()

      if (!isInitialized) {
        console.log('Health Connect를 사용할 수 없습니다')
        return { steps: 0, weight: 0, bmi: 0, stepPercentage: 0 }
      }

      // request permissions
      await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Weight' },
        { accessType: 'read', recordType: 'Height' },
        // { accessType: 'write', recordType: 'Steps' },
        // { accessType: 'write', recordType: 'Weight' },
        // { accessType: 'write', recordType: 'Height' },
      ])

      const now = new Date()
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      console.log('startOfDay:', startOfDay.toISOString())

      // 걸음 수
      const stepsResult = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: now.toISOString(),
        },
      })
      const totalSteps = stepsResult.records.reduce(
        (sum: number, record: any) => sum + (record.count || 0),
        0
      )

      // 체중 (최근 30일)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

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

      // 키 (최근 1년)
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
          ? heightResult.records[heightResult.records.length - 1].height
              .inMeters
          : 0

      // BMI 계산
      let bmi = 0
      if (latestWeight > 0 && latestHeight > 0) {
        bmi = latestWeight / (latestHeight * latestHeight)
      }

      // 걸음 수 % 계산 (9000걸음 목표 대비)
      const stepGoal = 9000
      let stepPercentage = (totalSteps / stepGoal) * 100
      stepPercentage = Math.round(stepPercentage * 10) / 10

      console.log('Android 헬스 데이터:', {
        totalSteps,
        latestWeight,
        latestHeight,
        bmi,
        stepPercentage,
      })

      return {
        steps: Math.round(totalSteps),
        weight: Math.round(latestWeight),
        bmi: Math.round(bmi * 10) / 10, // 소수점 1자리
        stepPercentage: stepPercentage,
      }
    } catch (error) {
      console.error('Android 헬스 데이터 가져오기 오류:', error)
      return {
        steps: 0,
        weight: 0,
        bmi: 0,
        stepPercentage: 0,
      }
    }
  }
}
