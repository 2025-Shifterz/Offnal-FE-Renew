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
    // 모든 데이터를 병렬로 가져오기
    const [stepsRes, weightRes, bmiRes] = await Promise.allSettled([
      this.dataSource.getSteps(),
      this.dataSource.getWeight(),
      this.dataSource.getBMI(),
    ])

    // 값 추출
    const steps = stepsRes.status === 'fulfilled' ? stepsRes.value : 0
    const weight = weightRes.status === 'fulfilled' ? weightRes.value : 0
    const bmi = bmiRes.status === 'fulfilled' ? bmiRes.value : 0

    // 걸음 수 % 계산 (9000걸음 목표 대비)
    const stepPercentage = (steps / STEP_GOAL) * 100

    return {
      steps: steps,
      weight: Math.round(weight * 10) / 10,
      bmi: Math.round(bmi * 10) / 10,
      stepPercentage: Math.round(stepPercentage * 10) / 10,
    }
  }
}
