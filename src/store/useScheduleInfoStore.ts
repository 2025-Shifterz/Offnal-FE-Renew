import { create } from 'zustand'
import { WorkTime } from '../shared/types/WorkTime'
import { scheduleInfoRepository } from '../infrastructure/di/Dependencies'

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
}

export const useScheduleInfoStore = create<ScheduleInfoState>(set => ({
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
    set(state => ({
      workTimes: {
        ...state.workTimes,
        [type]: {
          ...state.workTimes[type],
          [mode]: value,
        },
      },
    })),
  setAllWorkTimes: (workTimes: WorkTime) => set(() => ({ workTimes })),

  fetchScheduleInfo: async (organizationName: string, team: string) => {
    try {
      const data = await scheduleInfoRepository.getScheduleInfo(
        organizationName,
        team
      )
      useScheduleInfoStore.getState().setAllWorkTimes(data)
    } catch (error) {
      console.error('Failed to fetch schedule info:', error)
    }
  },
}))
