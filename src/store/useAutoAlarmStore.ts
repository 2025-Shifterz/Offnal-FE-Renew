import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AutoAlarm } from '../domain/models/AutoAlarm'
import {
  autoAlarmRepository,
  getHolidayDateSetUseCase,
} from '../infrastructure/di/Dependencies'
import {
  toCreateAutoAlarmInput,
  toUpdateAutoAlarmInput,
} from '../presentation/alarm/mappers/alarmDraftMapper'
import {
  AlarmDraft,
  CreateAutoAlarmDraft,
  UpdateAutoAlarmDraft,
} from '../presentation/alarm/types/alarmDraft'
import { useCalendarStore } from './useCalendarStore'
import { useScheduleInfoStore } from './useScheduleInfoStore'
import { useTeamCalendarStore } from './useTeamCalendarStore'
import { createWorkTypeResolver } from '../shared/utils/alarm/workTypeResolver'
import { resolveAutoAlarmNextTriggerAtMillis } from '../shared/utils/alarm/resolveAutoAlarmNextTriggerAtMillis'

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
  deleteAutoAlarms: (ids: number[]) => Promise<void>
  setAutoAlarmsEnabled: (ids: number[], enabled: boolean) => Promise<void>

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

const resolveNextTriggerAtMillisForDraft = async (
  draft: AlarmDraft
): Promise<number> => {
  const calendarData = useCalendarStore.getState().calendarData
  const teamCalendarData = useTeamCalendarStore.getState().teamCalendarData
  const currentTeam =
    useScheduleInfoStore.getState().workGroup ||
    useTeamCalendarStore.getState().myTeam

  const resolveWorkTypeForDate = createWorkTypeResolver({
    calendarData,
    teamCalendarData,
    currentTeam,
  })

  const nextTriggerAtMillis = await resolveAutoAlarmNextTriggerAtMillis({
    alarmTime: draft.alarmTime,
    selectedDays: draft.selectedDays,
    selectedWorkType: draft.selectedWorkType,
    isHolidayAlarmOff: draft.isHolidayAlarmOff,
    getHolidayDateSet: year => getHolidayDateSetUseCase.execute(year),
    resolveWorkTypeForDate,
  })

  if (nextTriggerAtMillis === null) {
    throw new Error(
      '조건을 만족하는 다음 알람 시간을 찾을 수 없습니다. 근무 일정, 요일, 공휴일 조건을 확인해 주세요.'
    )
  }

  return nextTriggerAtMillis
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
        const nextTriggerAtMillis =
          await resolveNextTriggerAtMillisForDraft(draft)
        const createdAutoAlarm = await autoAlarmRepository.addAutoAlarm(
          toCreateAutoAlarmInput(draft, nextTriggerAtMillis)
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
        const nextTriggerAtMillis =
          await resolveNextTriggerAtMillisForDraft(draft)
        const updatedAutoAlarm = await autoAlarmRepository.updateAutoAlarm(
          toUpdateAutoAlarmInput(draft, nextTriggerAtMillis)
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
      await get().deleteAutoAlarms([id])
    },

    deleteAutoAlarms: async ids => {
      set({ isLoading: true, error: null })
      const targetIds = [...new Set(ids)]

      if (targetIds.length === 0) {
        set({ isLoading: false })
        return
      }

      try {
        await autoAlarmRepository.deleteAutoAlarms(targetIds)
        const targetIdSet = new Set(targetIds)

        set(state => {
          state.autoAlarms = state.autoAlarms.filter(
            alarm => !targetIdSet.has(alarm.id)
          )
          state.selectedAlarmIds = state.selectedAlarmIds.filter(
            selectedAlarmId => !targetIdSet.has(selectedAlarmId)
          )
        })
      } catch (error) {
        const autoAlarms = await loadAutoAlarms(get().sortMode)
        set({ error: getErrorMessage(error) })
        set({ autoAlarms })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    setAutoAlarmsEnabled: async (ids, enabled) => {
      set({ isLoading: true, error: null })
      const targetIds = [...new Set(ids)]

      if (targetIds.length === 0) {
        set({ isLoading: false })
        return
      }

      try {
        await autoAlarmRepository.setAutoAlarmsEnabled(targetIds, enabled)
        const targetIdSet = new Set(targetIds)

        set(state => {
          state.autoAlarms = state.autoAlarms.map(alarm =>
            targetIdSet.has(alarm.id) ? { ...alarm, isEnabled: enabled } : alarm
          )
          state.autoAlarms = sortAutoAlarms(state.autoAlarms, state.sortMode)
        })
      } catch (error) {
        const autoAlarms = await loadAutoAlarms(get().sortMode)
        set({ error: getErrorMessage(error) })
        set({ autoAlarms })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteSelectedAutoAlarms: async () => {
      const selectedAlarmIds = [...get().selectedAlarmIds]
      await get().deleteAutoAlarms(selectedAlarmIds)
      set({ selectedAlarmIds: [] })
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
