import { WorkType } from '../../../domain/models/Calendar'
import { DateAndWorkTypeRecord } from '../../types/Calendar'
import { TeamCalendarRecord } from '../../types/TeamCalendar'

export interface WorkTypeResolverInput {
  calendarData: DateAndWorkTypeRecord
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

  return (dateKey: string): WorkType | null => {
    const personalWorkType = calendarData[dateKey]?.workTypeName
    if (personalWorkType) {
      return personalWorkType
    }

    const teamWorkType = currentTeamRecord?.workInstances[dateKey]?.workTypeName

    return teamWorkType ?? null
  }
}
