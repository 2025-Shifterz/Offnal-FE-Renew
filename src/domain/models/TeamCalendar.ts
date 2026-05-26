import { ShiftType } from './Calendar'

export interface TeamCalendar {
  myTeam: string
  teams: GetTeamWorkCalendarTeamsArray[]
}

export interface GetTeamWorkCalendarTeamsArray {
  team: string
  workInstances: GetTeamWorkCalendarWorkInstancesArray[]
}

export interface GetTeamWorkCalendarWorkInstancesArray {
  date: string
  workTypeName: ShiftType
  startTime: string
  endTime: string
}
