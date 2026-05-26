import { ShiftType } from '../../shared/types/Calendar'

export interface TeamCalendarEntity {
  myTeam: string
  teams: GetTeamWorkCalendarTeamsArray[]
}

export interface GetTeamWorkCalendarTeamsArray {
  team: string
  shiftInstances: GetTeamWorkCalendarShiftInstancesArray[]
}

export interface GetTeamWorkCalendarShiftInstancesArray {
  date: string
  shiftTypeName: ShiftType
  startTime: string
  endTime: string
}
