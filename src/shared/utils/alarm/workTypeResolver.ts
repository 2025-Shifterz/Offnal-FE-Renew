import { ShiftType } from '../../../domain/models/Calendar'
import { DateAndShiftTypeRecord } from '../../types/Calendar'
import { TeamCalendarRecord } from '../../types/TeamCalendar'

export interface WorkTypeResolverInput {
  calendarData: DateAndShiftTypeRecord
  teamCalendarData: TeamCalendarRecord[]
  currentTeam: string
}

export const createWorkTypeResolver = ({
  calendarData,
  teamCalendarData,
  currentTeam,
}: WorkTypeResolverInput) => {
  const currentTeamRecord = teamCalendarData.find(
    item => item.team === currentTeam
  )

  return (dateKey: string): ShiftType | null => {
    const personalWorkType = calendarData[dateKey]?.shiftTypeName
    if (personalWorkType) {
      return personalWorkType
    }

    const teamWorkType =
      currentTeamRecord?.shiftInstances[dateKey]?.shiftTypeName

    return teamWorkType ?? null
  }
}
