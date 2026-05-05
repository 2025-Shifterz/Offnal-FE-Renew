import { create } from 'zustand'
import {
  RoutineCompletionMap,
  RoutineDay,
} from '../shared/components/routine/routineContent'

export type RoutineCompletionByDay = Record<RoutineDay, RoutineCompletionMap>

type RoutineStoreState = {
  completionByDay: RoutineCompletionByDay
  toggleRoutineCompletion: (day: RoutineDay, itemId: string) => void
  setRoutineCompletion: (
    day: RoutineDay,
    itemId: string,
    completed: boolean
  ) => void
  clearRoutineCompletion: (day?: RoutineDay) => void
}

export const createEmptyRoutineCompletionByDay =
  (): RoutineCompletionByDay => ({
    today: {},
    tomorrow: {},
  })

export const useRoutineStore = create<RoutineStoreState>(set => ({
  completionByDay: createEmptyRoutineCompletionByDay(),

  toggleRoutineCompletion: (day, itemId) => {
    set(state => {
      const currentDayCompletion = state.completionByDay[day]
      const nextCompleted = !currentDayCompletion[itemId]

      return {
        completionByDay: {
          ...state.completionByDay,
          [day]: {
            ...currentDayCompletion,
            [itemId]: nextCompleted,
          },
        },
      }
    })
  },

  setRoutineCompletion: (day, itemId, completed) => {
    set(state => ({
      completionByDay: {
        ...state.completionByDay,
        [day]: {
          ...state.completionByDay[day],
          [itemId]: completed,
        },
      },
    }))
  },

  clearRoutineCompletion: day => {
    set(state => ({
      completionByDay: day
        ? {
            ...state.completionByDay,
            [day]: {},
          }
        : createEmptyRoutineCompletionByDay(),
    }))
  },
}))
