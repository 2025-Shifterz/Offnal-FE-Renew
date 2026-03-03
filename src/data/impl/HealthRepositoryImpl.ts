import { HealthRepository } from '../../domain/repositories/HealthRepository'
import { HealthDataSource } from '../../infrastructure/dataSource/interface/HealthDataSource'
import { STEP_GOAL } from '../../presentation/main/constants/stepGoal'
import { HealthData } from '../../shared/types/Health'

export class HealthRepositoryImpl implements HealthRepository {
  private dataSource: HealthDataSource

  constructor(dataSource: HealthDataSource) {
    this.dataSource = dataSource
  }

  async getHealthData(): Promise<HealthData> {
    try {
      const data = await this.dataSource.getHealthData()

      // 걸음 수 % 계산 (9000걸음 목표 대비)
      const stepPercentage = (data.totalSteps / STEP_GOAL) * 100

      return {
        steps: data.totalSteps,
        weight: Math.round(data.weight * 10) / 10,
        bmi: Math.round(data.bmi * 10) / 10,
        stepPercentage: Math.round(stepPercentage * 10) / 10,
      }
    } catch (error) {
      throw error
    }
  }
}
