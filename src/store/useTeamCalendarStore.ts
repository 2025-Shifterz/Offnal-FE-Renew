import { create } from 'zustand'
import {
  TeamCalendarRecord,
  TeamDateAndWorkType,
} from '../shared/types/TeamCalendar'
/*
<---- teamCalendarData 형태 ----> 

const teamCalendars: TeamCalendarRecord[] = [
  {
    team: "1조",
    dates: {
      "2025-07-01": { workTypeName: "오후", startTime: "16:00", endTime: "16:00" },
      "2025-07-02": { workTypeName: "오후", startTime: "16:00", endTime: "16:00" },
    }
  },
  {
    team: "2조",
    dates: {
      "2025-07-01": { workTypeName: "주간", startTime: "08:00", endTime: "14:30" },
    }
  }
]
*/

interface TeamCalendarState {
  teamCalendarData: TeamCalendarRecord[]

  setTeamCalendarData: (data: TeamDateAndWorkType[]) => void
}

export const useTeamCalendarStore = create<TeamCalendarState>()(set => ({
  teamCalendarData: [],
  setTeamCalendarData: (data: TeamDateAndWorkType[]) => {
    // 팀별로 묶어서 dates Record 생성
    const grouped: Record<string, TeamCalendarRecord> = {}

    data.forEach(item => {
      if (!grouped[item.team]) {
        grouped[item.team] = { team: item.team, dates: {} }
      }
      grouped[item.team].dates[item.date] = {
        workTypeName: item.workTypeName,
        startTime: item.startTime,
        endTime: item.endTime,
      }
    })

    set({ teamCalendarData: Object.values(grouped) })
  },
}))
