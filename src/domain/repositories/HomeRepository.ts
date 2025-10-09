import { Home } from '../models/Home'

export interface HomeRepository {
  getHomeData(): Promise<Home>
}
