import { TeamCalendar } from '../models/TeamCalendar'

export interface TeamCalendarRepository {
  getTeamCalendar(
    organizationName: string,
    startDate: string,
    endDate: string
  ): Promise<TeamCalendar>
}
