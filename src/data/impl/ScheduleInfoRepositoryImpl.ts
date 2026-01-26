import { WorkTime } from '../../domain/models/WorkTime'
import { ScheduleInfoRepository } from '../../domain/repositories/ScheduleInfoRepository'
import { ScheduleInfoService } from '../../infrastructure/remote/api/ScheduleInfoService'
import { toScheduleInfoDomain } from '../mappers/ScheduleInfoMapper'

export class ScheduleInfoRepositoryImpl implements ScheduleInfoRepository {
  constructor(private scheduleInfoService: ScheduleInfoService) {}

  async getScheduleInfo(
    organizationName: string,
    workGroup: string
  ): Promise<WorkTime> {
    try {
      const response = await this.scheduleInfoService.getScheduleInfo(
        organizationName,
        workGroup
      )
      const workTimes = toScheduleInfoDomain(response.workTimes)
      return workTimes
    } catch (error) {
      throw error
    }
  }
}
