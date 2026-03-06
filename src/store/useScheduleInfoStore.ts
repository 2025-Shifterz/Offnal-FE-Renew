import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { WorkTime } from '../domain/models/WorkTime'
import {
  organizationRepository,
  scheduleInfoRepository,
} from '../infrastructure/di/Dependencies'
import { Organization } from '../domain/models/Organization'

interface ScheduleInfoState {
  organizationName: string
  workGroup: string
  workTimes: WorkTime

  setOrganizationName: (name: string) => void
  setWorkGroup: (group: string) => void
  setWorkTimes: (
    type: keyof WorkTime,
    mode: 'startTime' | 'endTime',
    value: string
  ) => void
  setAllWorkTimes: (workTimes: WorkTime) => void

  fetchScheduleInfo: (organizationName: string, team: string) => Promise<void>
  fetchOrganization: () => Promise<Organization>
}

export const useScheduleInfoStore = create<ScheduleInfoState>()(
  immer(set => ({
    organizationName: '',
    workGroup: '1조',
    workTimes: {
      D: { startTime: '08:00', endTime: '16:00' },
      E: { startTime: '16:00', endTime: '00:00' },
      N: { startTime: '00:00', endTime: '08:00' },
      '-': { startTime: '', endTime: '' },
    },

    setOrganizationName: (name: string) =>
      set(() => ({ organizationName: name })),
    setWorkGroup: (group: string) => set(() => ({ workGroup: group })),
    setWorkTimes: (type, mode, value) =>
      set(state => {
        state.workTimes[type][mode] = value
      }),
    setAllWorkTimes: (workTimes: WorkTime) => set(() => ({ workTimes })),

    // 서버에서 불러오기 & 저장
    fetchScheduleInfo: async (organizationName: string, team: string) => {
      try {
        const data = await scheduleInfoRepository.getScheduleInfo(
          organizationName,
          team
        )
        useScheduleInfoStore.getState().setAllWorkTimes(data)
        set(() => ({ organizationName, workGroup: team }))
      } catch (error) {
        console.error('Failed to fetch schedule info:', error)
      }
    },
    fetchOrganization: async () => {
      try {
        const organization = await organizationRepository.getOrganization()
        set(() => ({
          organizationName: organization.organizationName,
        }))
        set(() => ({
          workGroup: organization.team,
        }))
        return organization
      } catch (error) {
        console.error('Failed to fetch organization:', error)
        throw error
      }
    },
  }))
)
