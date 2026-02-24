import { Platform } from 'react-native'
import { HealthRepository } from '../../domain/repositories/HealthRepository'
import { IosHealthDataSource } from '../../infrastructure/dataSource/IosHealthDataSource'
import { AndroidHealthDataSource } from '../../infrastructure/dataSource/AndroidHealthDataSource'

export class HealthRepositoryImpl implements HealthRepository {
  private dataSource: HealthRepository

  constructor() {
    this.dataSource =
      Platform.OS === 'ios'
        ? new IosHealthDataSource()
        : new AndroidHealthDataSource()
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
