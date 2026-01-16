import { fromShiftType } from '../../../data/mappers/ShiftTypeMapper'
import { TeamCalendarRecord } from '../../../shared/types/TeamCalendar'

// 근무표 수정 request 형식 맞춤 Mapper
export function toUpdateTeamShiftRecord(
  teamCalendarData: TeamCalendarRecord[]
) {
  const payload = {
    calendars: teamCalendarData.map(t => ({
      team: t.team,
      shifts: Object.fromEntries(
        Object.entries(t.workInstances).map(([date, instance]) => [
          date,
          fromShiftType(instance.workTypeName),
        ])
      ),
    })),
  }

  return payload
}
