import { HealthData } from '../../shared/types/Health'

export interface HealthRepository {
  getHealthData(): Promise<HealthData>
}
