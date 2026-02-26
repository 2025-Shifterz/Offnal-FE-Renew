import { HealthRepository } from '../../domain/repositories/HealthRepository'

export class HealthRepositoryImpl implements HealthRepository {
  private dataSource: HealthRepository

  constructor(dataSource: HealthRepository) {
    this.dataSource = dataSource
  }

  async getHealthData() {
    try {
      return await this.dataSource.getHealthData()
    } catch (error) {
      console.error('HealthRepositoryImpl getHealthData error:', error)
      return {
        steps: 0,
        weight: 0,
        bmi: 0,
        stepPercentage: 0,
      }
    }
  }
}
