export interface UpdateTeamShiftsRequest {
  calendars: CalendarDataByTeam[]
}

export interface CalendarDataByTeam {
  team: string
  shifts: {
    [day: string]: string
  }
}
