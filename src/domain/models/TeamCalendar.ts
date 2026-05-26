import { ShiftType } from './Calendar'

export interface TeamCalendar {
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
