import { HomeEntity } from '../../data/models/HomeEntity'

export interface HomeRepository {
  getHomeData(): Promise<HomeEntity>
}
