import { Routine } from '../../domain/models/Routine'
import { Schedule } from '../../domain/models/Schedule'
import { HomeRepository } from '../../domain/repositories/HomeRepository'
import { HomeService } from '../../infrastructure/remote/api/HomeService'
import { toRoutineDomain, toScheduleDomain } from '../mappers/HomeMappers'

export class HomeRepositoryImpl implements HomeRepository {
  constructor(private homeService: HomeService) {}

  async getSchedule(): Promise<Schedule> {
    const response = await this.homeService.getSchedule()
    const result = toScheduleDomain(response)

    return result
  }

  async getRoutine(): Promise<Routine> {
    const response = await this.homeService.getRoutine()
    const result = toRoutineDomain(response.data.meals, response.data.health)

    return result
  }

  async getRoutineByDate(date: string): Promise<Routine> {
    const response = await this.homeService.getRoutineByDate(date)
    const result = toRoutineDomain(response.data.meals, response.data.health)

    return result
  }
}
