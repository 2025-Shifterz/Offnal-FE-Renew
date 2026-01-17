import { create } from 'zustand'
import { WorkTime } from '../shared/types/WorkTime'

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
}

export const useScheduleInfoStore = create<ScheduleInfoState>(set => ({
  organizationName: '',
  workGroup: '1조',
  workTimes: {
    D: { startTime: '08:00', endTime: '16:00' },
    E: { startTime: '16:00', endTime: '00:00' },
    N: { startTime: '00:00', endTime: '08:00' },
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
}))
