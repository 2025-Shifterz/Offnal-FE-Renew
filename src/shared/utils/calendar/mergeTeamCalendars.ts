import { TeamCalendarRecord, WorkTypeInfo } from '../../types/TeamCalendar'

export const mergeTeamCalendars = (
  original: TeamCalendarRecord[],
  updates: TeamCalendarRecord[]
): TeamCalendarRecord[] => {
  return original.map(orig => {
    const updatedTeam = updates.find(up => up.team === orig.team)
    if (!updatedTeam) return orig

    // 기존 workInstances 복사
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
}
