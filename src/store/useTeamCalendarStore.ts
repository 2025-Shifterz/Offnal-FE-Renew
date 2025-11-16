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
      "2025-07-01": { workTypeName: "오후" },
      "2025-07-02": { workTypeName: "오후" },
    }
  },
  {
    team: "2조",
    dates: {
      "2025-07-01": { workTypeName: "주간" },
    }
  }
]
*/

interface TeamCalendarState {
  teamCalendarData: TeamCalendarRecord[]

  setTeamCalendarData: (data: TeamDateAndWorkType[]) => void
  updateTeamCalendarDay: (update: {
    team: string
    date: string
    workTypeName: string
  }) => void
  clearTeamCalendarData: () => void
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
      }
    })

    set({ teamCalendarData: Object.values(grouped) })
  },
  updateTeamCalendarDay: ({ team, date, workTypeName }) => {
    set(state => {
      const newData = [...state.teamCalendarData]
      const teamIndex = newData.findIndex(t => t.team === team)

      if (teamIndex > -1) {
        // 팀 존재 시 날짜 업데이트
        const teamRecord = {
          ...newData[teamIndex],
          dates: { ...newData[teamIndex].dates },
        }

        if (teamRecord.dates[date]?.workTypeName === workTypeName) {
          // 같은 근무 타입이면 삭제
          delete teamRecord.dates[date]
        } else {
          // 새 근무 타입 적용
          teamRecord.dates[date] = { workTypeName }
        }

        newData[teamIndex] = teamRecord
      } else {
        // 팀이 없으면 새 팀 생성
        newData.push({
          team,
          dates: { [date]: { workTypeName } },
        })
      }
      // teamCalendarData 업데이트
      return { teamCalendarData: newData }
    })
  },
  clearTeamCalendarData: () => set({ teamCalendarData: [] }),
}))
