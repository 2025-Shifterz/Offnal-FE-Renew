import { Home } from '../../domain/models/Home'
import { HomeRepository } from '../../domain/repositories/HomeRepository'
import { HomeService } from '../../infrastructure/remote/api/HomeService'
import { toHomeDomain } from '../mappers/HomeMappers'

export class HomeRepositoryImpl implements HomeRepository {
  constructor(private homeService: HomeService) {}

  async getHomeData(): Promise<Home> {
    const response = await this.homeService.getHome()

    if (response === null) {
      throw new Error('해당 일자에 근무 정보가 없음')
    }
    const result = toHomeDomain(response)

    return result
  }
}
