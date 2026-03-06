import { WorkType } from './Calendar'

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
  workTypeName: WorkType
  startTime: string
  endTime: string
}
