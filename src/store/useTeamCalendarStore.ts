import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  TeamCalendarRecord,
  TeamDateAndWorkType,
} from '../shared/types/TeamCalendar'
import { useScheduleInfoStore } from './useScheduleInfoStore'
import { teamCalendarRepository } from '../infrastructure/di/Dependencies'
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
  newTeamCalendarData: TeamCalendarRecord[] // 편집용
  myTeam: string

  setTeamCalendarData: (
    data: (TeamDateAndWorkType & { team: string })[]
  ) => void
  setNewTeamCalendarData: (
    data: (TeamDateAndWorkType & { team: string })[]
  ) => void
  updateNewTeamCalendarDay: (update: {
    team: string
    date: string
    workTypeName: string
  }) => void
  updateTeamCalendarDay: (update: {
    team: string
    date: string
    workTypeName: string
  }) => void
  setMyTeam: (team: string) => void
  clearTeamCalendarData: () => void
  clearNewTeamCalendarData: () => void

  // 서버에서 데이터 불러오기 & 저장
  fetchTeamCalendarData: (
    organizationName: string,
    startDate: string,
    endDate: string
  ) => Promise<void>
}

export const useTeamCalendarStore = create<TeamCalendarState>()(
  immer(set => ({
    teamCalendarData: [],
    newTeamCalendarData: [],
    myTeam: '',
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
          workTypeName,
          startTime,
          endTime,
        }
      })

      set({ teamCalendarData: Object.values(grouped) })
    },
    setNewTeamCalendarData: (
      data: (TeamDateAndWorkType & { team: string })[]
    ) => {
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
          workTypeName,
          startTime,
          endTime,
        }
      })

      set({ newTeamCalendarData: Object.values(grouped) })
    },
    updateNewTeamCalendarDay: ({ team, date, workTypeName }) => {
      set(state => {
        const teamRecord = state.newTeamCalendarData.find(t => t.team === team)

        if (teamRecord) {
          const existing = teamRecord.workInstances[date]

          if (existing && existing.workTypeName === workTypeName) {
            delete teamRecord.workInstances[date]
          } else {
            teamRecord.workInstances[date] = {
              workTypeName,
              startTime: existing?.startTime || '',
              endTime: existing?.endTime || '',
            }
          }
        } else {
          state.newTeamCalendarData.push({
            team,
            workInstances: {
              [date]: {
                workTypeName,
                startTime: '',
                endTime: '',
              },
            },
          })
        }
      })
    },
    updateTeamCalendarDay: ({ team, date, workTypeName }) => {
      set(state => {
        const teamRecord = state.teamCalendarData.find(t => t.team === team)

        if (teamRecord) {
          const existing = teamRecord.workInstances[date]

          if (existing && existing.workTypeName === workTypeName) {
            delete teamRecord.workInstances[date]
          } else {
            teamRecord.workInstances[date] = {
              workTypeName,
              startTime: existing?.startTime || '',
              endTime: existing?.endTime || '',
            }
          }
        } else {
          state.teamCalendarData.push({
            team,
            workInstances: {
              [date]: {
                workTypeName,
                startTime: '',
                endTime: '',
              },
            },
          })
        }
      })
    },
    setMyTeam: (team: string) => {
      set(() => ({ myTeam: team }))
      useScheduleInfoStore.getState().setWorkGroup(team)
    },

    clearTeamCalendarData: () => set({ teamCalendarData: [] }),
    clearNewTeamCalendarData: () => set({ newTeamCalendarData: [] }),
    // 서버에서 데이터 불러오기 & 저장
    fetchTeamCalendarData: async (
      organizationName: string,
      startDate: string,
      endDate: string
    ) => {
      try {
        const response = await teamCalendarRepository.getTeamCalendar(
          organizationName,
          startDate,
          endDate
        )
        console.log('Fetched team calendar response:', response)
        // 서버 workType → 내부 WorkType 필드에 맞게 매핑 필요하면 fromShiftType 사용
        const flattened: (TeamDateAndWorkType & { team: string })[] =
          response.teams.flatMap(teamRecord =>
            teamRecord.workInstances.map(wi => ({
              team: teamRecord.team,
              date: wi.date,
              workTypeName: wi.workTypeName,
              startTime: wi.startTime,
              endTime: wi.endTime,
            }))
          )
        set({ myTeam: response.myTeam })

        useTeamCalendarStore.getState().setTeamCalendarData(flattened)
        console.log('Fetched team calendar data:', flattened)
      } catch (error) {
        throw error
      }
    },
  }))
)
