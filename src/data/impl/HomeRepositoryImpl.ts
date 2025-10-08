import { HomeRepository } from '../../domain/repositories/HomeRepository'
import { HomeService } from '../../infrastructure/remote/api/HomeService'
import { toHomeDataModel } from '../mappers/HomeMappers'
import { HomeEntity } from '../models/HomeEntity'

export class HomeRepositoryImpl implements HomeRepository {
  constructor(private homeService: HomeService) {}

  async getHomeData(): Promise<HomeEntity> {
    try {
      const response = await this.homeService.getHome()

      if (response === null) {
        throw new Error('해당 일자에 근무 정보가 없음')
      }
      const result = toHomeDataModel(response)

      return result
    } catch (error) {
      throw error
    }
  }
}
