import { TeamCalendarRecord, WorkTypeInfo } from '../../types/TeamCalendar'

export const mergeTeamCalendars = (
  original: TeamCalendarRecord[],
  updates: TeamCalendarRecord[]
): TeamCalendarRecord[] => {
  const mergedOriginal = original.map(orig => {
    const updatedTeam = updates.find(up => up.team === orig.team)
    if (!updatedTeam) return orig

    const mergedWorkInstances: Record<string, WorkTypeInfo> = {
      ...orig.workInstances,
    }

    Object.entries(updatedTeam.workInstances).forEach(([date, workInfo]) => {
      mergedWorkInstances[date] = workInfo
    })
    return {
      ...orig,
      workInstances: mergedWorkInstances,
    }
  })

  const originalTeams = new Set(original.map(teamRecord => teamRecord.team))
  const appendedUpdates = updates.filter(
    updateTeam => !originalTeams.has(updateTeam.team)
  )

  return [...mergedOriginal, ...appendedUpdates]
}
