import { WorkType } from '../../../shared/types/Calendar'

export interface GetTeamWorkCalendarResponse {
  code: string
  message: string
  data: GetTeamWorkCalendarResponseData
}

export interface GetTeamWorkCalendarResponseData {
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
  duration: string
}
