import { WorkTime } from '../models/WorkTime'

export interface ScheduleInfoRepository {
  getScheduleInfo(
    organizationName: string,
    workGroup: string
  ): Promise<WorkTime>
}
