import { ShiftTypeInfo } from '../../types/Calendar'
import { TeamCalendarRecord } from '../../types/TeamCalendar'

export const mergeTeamCalendars = (
  original: TeamCalendarRecord[],
  updates: TeamCalendarRecord[]
): TeamCalendarRecord[] => {
  const mergedOriginal = original.map(orig => {
    const updatedTeam = updates.find(up => up.team === orig.team)
    if (!updatedTeam) return orig

    const mergedShiftInstances: Record<string, ShiftTypeInfo> = {
      ...orig.shiftInstances,
    }

    Object.entries(updatedTeam.shiftInstances).forEach(([date, shiftInfo]) => {
      mergedShiftInstances[date] = shiftInfo
    })
    return {
      ...orig,
      shiftInstances: mergedShiftInstances,
    }
  })

  const originalTeams = new Set(original.map(teamRecord => teamRecord.team))
  const appendedUpdates = updates.filter(
    updateTeam => !originalTeams.has(updateTeam.team)
  )

  return [...mergedOriginal, ...appendedUpdates]
}
