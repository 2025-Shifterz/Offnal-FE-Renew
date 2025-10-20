import { HealthData } from '../../../shared/types/Health'

export class AndroidHealthService {
  getAndroidHealthService = async (): Promise<HealthData> => {
    console.log('Android 헬스 데이터 (준비 중)')

    return {
      steps: 0,
      weight: 0,
      bmi: 0,
    }
  }
}
