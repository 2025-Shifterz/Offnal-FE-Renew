import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AutoAlarm } from '../domain/models/AutoAlarm'
import { autoAlarmRepository } from '../infrastructure/di/Dependencies'
import {
  toCreateAutoAlarmInput,
  toUpdateAutoAlarmInput,
} from '../presentation/alarm/mappers/alarmDraftMapper'
import {
  CreateAutoAlarmDraft,
  UpdateAutoAlarmDraft,
} from '../presentation/alarm/types/alarmDraft'

type AutoAlarmSortMode = 'workType' | 'remainingTime'

type AutoAlarmState = {
  isLoading: boolean
  autoAlarms: AutoAlarm[]
  selectedAlarmIds: number[]

  error: string | null
  sortMode: AutoAlarmSortMode

  fetchAllAutoAlarms: () => Promise<void>

  createAutoAlarm: (draft: CreateAutoAlarmDraft) => Promise<void>
  updateAutoAlarm: (draft: UpdateAutoAlarmDraft) => Promise<void>
  toggleAutoAlarm: (id: number, enabled: boolean) => Promise<void>
  deleteAutoAlarm: (id: number) => Promise<void>

  deleteSelectedAutoAlarms: () => Promise<void>

  toggleSelectedAutoAlarmId: (id: number) => void
  clearSelectedAutoAlarmIds: () => void

  setSortMode: (sortMode: AutoAlarmSortMode) => void
}

const workTypeSortOrder: Record<string, number> = {
  주간: 0,
  오후: 1,
  야간: 2,
  휴일: 3,
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown error'
}

const getWorkTypeOrder = (workTypeTitle: string): number => {
  return workTypeSortOrder[workTypeTitle] ?? Number.MAX_SAFE_INTEGER
}

const sortAutoAlarms = (
  autoAlarms: AutoAlarm[],
  sortMode: AutoAlarmSortMode
): AutoAlarm[] => {
  return [...autoAlarms].sort((left, right) => {
    if (sortMode === 'workType') {
      const byWorkType =
        getWorkTypeOrder(left.workTypeTitle) -
        getWorkTypeOrder(right.workTypeTitle)

      if (byWorkType !== 0) {
        return byWorkType
      }
    } else {
      const byRemainingTime =
        left.nextTriggerAtMillis - right.nextTriggerAtMillis

      if (byRemainingTime !== 0) {
        return byRemainingTime
      }
    }

    const byHour = left.time.hour - right.time.hour
    if (byHour !== 0) {
      return byHour
    }

    const byMinute = left.time.minute - right.time.minute
    if (byMinute !== 0) {
      return byMinute
    }

    return left.id - right.id
  })
}

const upsertAutoAlarm = (
  autoAlarms: AutoAlarm[],
  nextAutoAlarm: AutoAlarm
): void => {
  const index = autoAlarms.findIndex(alarm => alarm.id === nextAutoAlarm.id)

  if (index === -1) {
    autoAlarms.push(nextAutoAlarm)
    return
  }

  autoAlarms[index] = nextAutoAlarm
}

const loadAutoAlarms = async (
  sortMode: AutoAlarmSortMode
): Promise<AutoAlarm[]> => {
  const autoAlarms = await autoAlarmRepository.getAllAutoAlarms()
  return sortAutoAlarms(autoAlarms, sortMode)
}

export const useAutoAlarmStore = create<AutoAlarmState>()(
  immer((set, get) => ({
    isLoading: false,
    autoAlarms: [],
    selectedAlarmIds: [],
    error: null,
    sortMode: 'remainingTime',

    fetchAllAutoAlarms: async () => {
      set({ isLoading: true, error: null })
      try {
        const autoAlarms = await loadAutoAlarms(get().sortMode)
        set({ autoAlarms })
      } catch (error) {
        set({ error: getErrorMessage(error) })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    createAutoAlarm: async draft => {
      set({ isLoading: true, error: null })
      try {
        const createdAutoAlarm = await autoAlarmRepository.addAutoAlarm(
          toCreateAutoAlarmInput(draft)
        )

        set(state => {
          upsertAutoAlarm(state.autoAlarms, createdAutoAlarm)
          state.autoAlarms = sortAutoAlarms(state.autoAlarms, state.sortMode)
        })
      } catch (error) {
        set({ error: getErrorMessage(error) })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    updateAutoAlarm: async draft => {
      set({ isLoading: true, error: null })
      try {
        const updatedAutoAlarm = await autoAlarmRepository.updateAutoAlarm(
          toUpdateAutoAlarmInput(draft)
        )

        set(state => {
          upsertAutoAlarm(state.autoAlarms, updatedAutoAlarm)
          state.autoAlarms = sortAutoAlarms(state.autoAlarms, state.sortMode)
        })
      } catch (error) {
        set({ error: getErrorMessage(error) })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    toggleAutoAlarm: async (id, enabled) => {
      set({ isLoading: true, error: null })
      try {
        const toggledAutoAlarm = await autoAlarmRepository.toggleAutoAlarm(
          id,
          enabled
        )

        const hasCachedAutoAlarm = get().autoAlarms.some(
          alarm => alarm.id === id
        )

        if (!hasCachedAutoAlarm) {
          const autoAlarms = await loadAutoAlarms(get().sortMode)
          set({ autoAlarms })
          return
        }

        set(state => {
          upsertAutoAlarm(state.autoAlarms, toggledAutoAlarm)
          state.autoAlarms = sortAutoAlarms(state.autoAlarms, state.sortMode)
        })
      } catch (error) {
        set({ error: getErrorMessage(error) })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteAutoAlarm: async id => {
      set({ isLoading: true, error: null })
      try {
        await autoAlarmRepository.deleteAutoAlarm(id)

        set(state => {
          state.autoAlarms = state.autoAlarms.filter(alarm => alarm.id !== id)
          state.selectedAlarmIds = state.selectedAlarmIds.filter(
            selectedAlarmId => selectedAlarmId !== id
          )
        })
      } catch (error) {
        set({ error: getErrorMessage(error) })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteSelectedAutoAlarms: async () => {
      set({ isLoading: true, error: null })
      const selectedAlarmIds = [...get().selectedAlarmIds]

      if (selectedAlarmIds.length === 0) {
        set({ isLoading: false })
        return
      }

      try {
        for (const id of selectedAlarmIds) {
          await autoAlarmRepository.deleteAutoAlarm(id)
        }

        set(state => {
          state.autoAlarms = state.autoAlarms.filter(
            alarm => !selectedAlarmIds.includes(alarm.id)
          )
          state.selectedAlarmIds = []
        })
      } catch (error) {
        const autoAlarms = await loadAutoAlarms(get().sortMode)
        set({
          autoAlarms,
          selectedAlarmIds: [],
          error: getErrorMessage(error),
        })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    toggleSelectedAutoAlarmId: (id: number) => {
      set(state => {
        const index = state.selectedAlarmIds.indexOf(id)

        if (index === -1) {
          state.selectedAlarmIds.push(id)
          return
        }

        state.selectedAlarmIds.splice(index, 1)
      })
    },

    clearSelectedAutoAlarmIds: () => {
      set({ selectedAlarmIds: [] })
    },

    setSortMode: (sortMode: AutoAlarmSortMode) => {
      set(state => {
        state.sortMode = sortMode
        state.autoAlarms = sortAutoAlarms(state.autoAlarms, sortMode)
      })
    },
  }))
)
