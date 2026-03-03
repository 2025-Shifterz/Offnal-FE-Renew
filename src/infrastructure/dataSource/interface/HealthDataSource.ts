import { GetHealthResponse } from '../../remote/response/GetHealthResponse'

export interface HealthDataSource {
  getHealthData(): Promise<GetHealthResponse>
}
