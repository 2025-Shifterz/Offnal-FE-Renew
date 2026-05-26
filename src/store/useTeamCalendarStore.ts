import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ShiftType } from '../shared/types/Calendar'
import {
  TeamCalendarRecord,
  TeamDateAndShiftType,
} from '../shared/types/TeamCalendar'
import { useScheduleInfoStore } from './useScheduleInfoStore'
import { teamCalendarRepository } from '../infrastructure/di/Dependencies'

interface TeamCalendarState {
  teamCalendarData: TeamCalendarRecord[]
  newTeamCalendarData: TeamCalendarRecord[] // 편집용
  myTeam: string

  setTeamCalendarData: (
    data: (TeamDateAndShiftType & { team: string })[]
  ) => void

  setNewTeamCalendarData: (
    data: (TeamDateAndShiftType & { team: string })[]
  ) => void

  updateNewTeamCalendarDay: (update: {
    team: string
    date: string
    shiftTypeName: ShiftType
  }) => void

  updateTeamCalendarDay: (update: {
    team: string
    date: string
    shiftTypeName: ShiftType
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

    setTeamCalendarData: (
      data: (TeamDateAndShiftType & { team: string })[]
    ) => {
      // 팀별로 묶어서 dates Record 생성
      const grouped: Record<string, TeamCalendarRecord> = {}

      data.forEach(item => {
        const { team, date, shiftTypeName, startTime, endTime } = item

        // 팀별 초기 구조 생성
        if (!grouped[team]) {
          grouped[team] = {
            team,
            shiftInstances: {},
          }
        }

        // 날짜를 key로 저장
        grouped[team].shiftInstances[date] = {
          shiftTypeName,
          startTime,
          endTime,
        }
      })

      set({ teamCalendarData: Object.values(grouped) })
    },

    setNewTeamCalendarData: (
      data: (TeamDateAndShiftType & { team: string })[]
    ) => {
      // 팀별로 묶어서 dates Record 생성
      const grouped: Record<string, TeamCalendarRecord> = {}

      data.forEach(item => {
        const { team, date, shiftTypeName, startTime, endTime } = item

        // 팀별 초기 구조 생성
        if (!grouped[team]) {
          grouped[team] = {
            team,
            shiftInstances: {},
          }
        }

        // 날짜를 key로 저장
        grouped[team].shiftInstances[date] = {
          shiftTypeName,
          startTime,
          endTime,
        }
      })

      set({ newTeamCalendarData: Object.values(grouped) })
    },

    updateNewTeamCalendarDay: ({ team, date, shiftTypeName }) => {
      set(state => {
        const teamRecord = state.newTeamCalendarData.find(t => t.team === team)

        if (teamRecord) {
          const existing = teamRecord.shiftInstances[date]

          if (existing && existing.shiftTypeName === shiftTypeName) {
            delete teamRecord.shiftInstances[date]
          } else {
            teamRecord.shiftInstances[date] = {
              shiftTypeName,
              startTime: existing?.startTime || '',
              endTime: existing?.endTime || '',
            }
          }
        } else {
          state.newTeamCalendarData.push({
            team,
            shiftInstances: {
              [date]: {
                shiftTypeName,
                startTime: '',
                endTime: '',
              },
            },
          })
        }
      })
    },

    updateTeamCalendarDay: ({ team, date, shiftTypeName }) => {
      set(state => {
        const teamRecord = state.teamCalendarData.find(t => t.team === team)

        if (teamRecord) {
          const existing = teamRecord.shiftInstances[date]

          if (existing && existing.shiftTypeName === shiftTypeName) {
            delete teamRecord.shiftInstances[date]
          } else {
            teamRecord.shiftInstances[date] = {
              shiftTypeName,
              startTime: existing?.startTime || '',
              endTime: existing?.endTime || '',
            }
          }
        } else {
          state.teamCalendarData.push({
            team,
            shiftInstances: {
              [date]: {
                shiftTypeName,
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
        const flattened: (TeamDateAndShiftType & { team: string })[] =
          response.teams.flatMap(teamRecord =>
            teamRecord.workInstances.map(wi => ({
              team: teamRecord.team,
              date: wi.date,
              shiftTypeName: wi.workTypeName,
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
