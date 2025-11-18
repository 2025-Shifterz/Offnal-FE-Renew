import { TeamCalendar } from '../../domain/models/TeamCalendar'
import { TeamCalendarRepository } from '../../domain/repositories/TeamCalendarRepository'
import { TeamCalendarService } from '../../infrastructure/remote/api/TeamCalendarService'
import { convertDurationToEndTime } from '../../shared/utils/calendar/convertDuration'
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

      // DTO -> Entity
      const teamCalendar: TeamCalendar = {
        myTeam: res.myTeam,
        teams: res.teams.map(team => ({
          team: team.team,
          workInstances: team.workInstances.map(wi => ({
            date: wi.date,
            workTypeName: wi.workType,
            startTime: wi.startTime ?? '',
            endTime: convertDurationToEndTime(wi.startTime, wi.duration) ?? '',
          })),
        })),
      }

      // Entity -> Domain
      const domainTeamCalendar = toTeamCalendarDomain(teamCalendar)

      return domainTeamCalendar
    } catch (error) {
      throw error
    }
  }
}
