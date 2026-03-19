export interface HealthDataSource {
  getSteps(): Promise<number>

  getWeight(): Promise<number>

  getBMI(): Promise<number>
}
