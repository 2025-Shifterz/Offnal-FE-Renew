import { TeamCalendar } from '../../domain/models/TeamCalendar'
import { TeamCalendarRepository } from '../../domain/repositories/TeamCalendarRepository'
import { TeamCalendarService } from '../../infrastructure/remote/api/TeamCalendarService'
import { UpdateTeamShiftsRequest } from '../../infrastructure/remote/request/PatchTeamWorkCalendarRequest'
import { toTeamCalendarDomain } from '../mappers/TeamCalendarMapper'

export class TeamCalendarRepositoryImpl implements TeamCalendarRepository {
  constructor(private teamCalendarService: TeamCalendarService) {}

  async getTeamCalendar(
    organizationName: string,
    startDate: string,
    endDate: string
  ): Promise<TeamCalendar> {
    try {
      const res = await this.teamCalendarService.getTeamWorkCalendar(
        organizationName,
        startDate,
        endDate
      )

      // DTO -> Domain
      return toTeamCalendarDomain(res)
    } catch (error) {
      throw error
    }
  }

  async updateTeamCalendar(
    organizationName: string,
    teamShiftsData: UpdateTeamShiftsRequest
  ) {
    try {
      const res = await this.teamCalendarService.updateTeamWorkCalendar(
        organizationName,
        teamShiftsData
      )
      return res
    } catch (error) {
      throw error
    }
  }
}
