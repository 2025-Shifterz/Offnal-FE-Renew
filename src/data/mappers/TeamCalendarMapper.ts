import { TeamCalendar } from '../../domain/models/TeamCalendar'
import { GetTeamWorkCalendarResponseData } from '../../infrastructure/remote/response/GetTeamWorkCalendarResponse'
import { convertDurationToEndTime } from '../../shared/utils/calendar/convertDuration'

export const toTeamCalendarDomain = (
  response: GetTeamWorkCalendarResponseData
): TeamCalendar => {
  return {
    myTeam: response.myTeam,
    teams: response.teams.map(team => ({
      team: team.team,
      workInstances: team.workInstances.map(wi => ({
        date: wi.date,
        workTypeName: wi.workType,
        startTime: wi.startTime ?? '',
        endTime: convertDurationToEndTime(wi.startTime, wi.duration) ?? '',
      })),
    })),
  }
}
