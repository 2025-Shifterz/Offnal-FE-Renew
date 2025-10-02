import { create } from 'zustand'
import {
  WorkType,
  DateAndWorkType,
  CalendarState,
} from '../shared/types/Calendar'
import dayjs from 'dayjs'

/*
<---- calendarData 형태 ----> 

const calendarData: CalendarState = new Map([
  ["2025-09-01", { date: "2025-09-01", workTypeName: "오후" }],
  ["2025-09-02", { date: "2025-09-02", workTypeName: "오후" }],
  ["2025-09-04", { date: "2025-09-04", workTypeName: "휴일" }],
]);

*/

interface CalendarStore {
  calendarData: CalendarState
  selectedDate: dayjs.Dayjs | null
  isLoading: boolean

  setCalendarData: (data: DateAndWorkType[]) => void
  updateCalendarDay: (date: string, workTypeName: WorkType) => void
  clearCalendar: () => void
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  setLoading: (loading: boolean) => void
}
export const useCalendarStore = create<CalendarStore>(set => ({
  calendarData: new Map(),
  selectedDate: null,
  isLoading: false,

  setCalendarData: data =>
    set(() => {
      const mapped = new Map<string, DateAndWorkType>()
      data.forEach(item => mapped.set(item.date, item))
      return { calendarData: mapped }
    }),

  // 특정 날짜의 근무 형태 수정
  updateCalendarDay: (date, workTypeName) =>
    set(state => {
      const updated = new Map(state.calendarData)
      const existing = updated.get(date)
      if (existing?.workTypeName === workTypeName) {
        // 같은 날짜를 다시 클릭하면 제거 (같은 타입이면 삭제)
        updated.delete(date)
      } else {
        updated.set(date, { date, workTypeName })
      }
      return { calendarData: updated }
    }),

  // 캘린더 데이터 전체 삭제
  clearCalendar: () => set({ calendarData: new Map() }),

  setSelectedDate: date => set({ selectedDate: date }),

  setLoading: loading => set({ isLoading: loading }),
}))
