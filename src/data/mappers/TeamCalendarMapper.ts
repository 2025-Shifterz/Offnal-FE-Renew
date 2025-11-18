import { TeamCalendar } from '../../domain/models/TeamCalendar'
import { TeamCalendarEntity } from '../models/TeamCalendarEntity'

export const toTeamCalendarDomain = (
  entity: TeamCalendarEntity
): TeamCalendar => {
  return {
    myTeam: entity.myTeam,
    teams: entity.teams.map(team => ({
      team: team.team,
      workInstances: team.workInstances.map(workInstance => ({
        date: workInstance.date,
        workTypeName: workInstance.workTypeName,
        startTime: workInstance.startTime,
        endTime: workInstance.endTime,
      })),
    })),
  }
}
