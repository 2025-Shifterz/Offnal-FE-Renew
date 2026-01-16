import { UpdateTeamShiftsRequest } from '../../infrastructure/remote/request/PatchTeamWorkCalendarRequest'
import { TeamCalendar } from '../models/TeamCalendar'

export interface TeamCalendarRepository {
  getTeamCalendar(
    organizationName: string,
    startDate: string,
    endDate: string
  ): Promise<TeamCalendar>

  updateTeamCalendar(
    organizationName: string,
    teamShiftsData: UpdateTeamShiftsRequest
  ): Promise<void>
}
