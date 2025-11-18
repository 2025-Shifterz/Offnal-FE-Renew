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
    workInstances: {
      "2025-07-01": { workTypeName: "오후", startTime: "13:00", endTime: "21:00" },
      "2025-07-02": { workTypeName: "오후", startTime: "13:00", endTime: "21:00"},
    }
  },
  {
    team: "2조",
    workInstances: {
      "2025-07-01": { workTypeName: "주간", startTime: "09:00", endTime: "18:00"},
    }
  }
]
*/

interface TeamCalendarState {
  teamCalendarData: TeamCalendarRecord[]

  setTeamCalendarData: (
    data: (TeamDateAndWorkType & { team: string })[]
  ) => void
  updateTeamCalendarDay: (update: {
    team: string
    date: string
    workTypeName: string
  }) => void
  clearTeamCalendarData: () => void
}

export const useTeamCalendarStore = create<TeamCalendarState>()(set => ({
  teamCalendarData: [],
  setTeamCalendarData: (data: (TeamDateAndWorkType & { team: string })[]) => {
    // 팀별로 묶어서 dates Record 생성
    const grouped: Record<string, TeamCalendarRecord> = {}

    data.forEach(item => {
      const { team, date, workTypeName, startTime, endTime } = item

      // 팀별 초기 구조 생성
      if (!grouped[team]) {
        grouped[team] = {
          team,
          workInstances: {},
        }
      }

      // 날짜를 key로 저장
      grouped[team].workInstances[date] = {
        date,
        workTypeName,
        startTime,
        endTime,
      }
    })

    set({ teamCalendarData: Object.values(grouped) })
  },
  updateTeamCalendarDay: ({ team, date, workTypeName }) => {
    set(state => {
      const newData = [...state.teamCalendarData]
      const teamIndex = newData.findIndex(t => t.team === team)

      if (teamIndex > -1) {
        // 팀 존재
        const teamRecord = {
          ...newData[teamIndex],
          workInstances: { ...newData[teamIndex].workInstances },
        }

        const existing = teamRecord.workInstances[date]

        if (existing && existing.workTypeName === workTypeName) {
          // 같은 근무 타입이면 삭제
          delete teamRecord.workInstances[date]
        } else {
          // 새로운/다른 근무 타입 설정
          teamRecord.workInstances[date] = {
            date,
            workTypeName,
            startTime: existing?.startTime,
            endTime: existing?.endTime,
          }
        }

        newData[teamIndex] = teamRecord
      } else {
        // 팀 없으면 새로 추가
        newData.push({
          team,
          workInstances: {
            [date]: {
              date,
              workTypeName,
            },
          },
        })
      }

      return { teamCalendarData: newData }
    })
  },

  clearTeamCalendarData: () => set({ teamCalendarData: [] }),
}))
