// 어떤 한 달의 근무 일정 상태
import { create } from 'zustand'
import {
  WorkType,
  CalendarData,
  DateAndWorkType,
} from '../shared/types/Calendar'
import dayjs from 'dayjs'
import { calendarService } from '../infrastructure/di/Dependencies'

/*
<---- calendarData 형태 ----> 

{
  "2025-09-01": { workTypeName: "오후" },
  "2025-09-02": { workTypeName: "휴일" },
}

*/

interface CalendarState {
  calendarData: CalendarData
  selectedDate: dayjs.Dayjs | null
  currentYearMonth: { year: number; month: number }
  isLoading: boolean

  // setter
  setCalendarData: (data: DateAndWorkType[]) => void
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  setCurrentYearMonth: (year: number, month: number) => void
  updateCalendarDay: (date: string, workTypeName: WorkType) => void
  clearCalendarData: () => void
  setLoading: (loading: boolean) => void

  // fetch
  fetchCalendarData: (
    organizationId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>
}

export const useCalendarStore = create<CalendarState>(set => ({
  calendarData: {},
  selectedDate: null,
  currentYearMonth: { year: dayjs().year(), month: dayjs().month() + 1 },
  isLoading: false,

  setCalendarData: data =>
    set(() => {
      const mapped: CalendarData = {}
      data.forEach(item => {
        mapped[item.date] = { workTypeName: item.workTypeName }
      })
      return { calendarData: mapped }
    }),

  // 특정 날짜의 근무 형태 수정
  updateCalendarDay: (date, workTypeName) =>
    set(state => {
      const updated = { ...state.calendarData }
      const existing = updated[date]?.workTypeName
      if (existing === workTypeName) {
        // 같은 날짜를 다시 클릭하면 제거 (같은 타입이면 삭제)
        delete updated[date]
      } else {
        updated[date] = { workTypeName }
      }
      return { calendarData: updated }
    }),

  setCurrentYearMonth: (year, month) =>
    set({ currentYearMonth: { year, month } }),

  setSelectedDate: date => set({ selectedDate: date }),

  // 캘린더 데이터 전체 삭제
  clearCalendarData: () => set({ calendarData: {} }),

  setLoading: loading => set({ isLoading: loading }),

  // 서버에서 캘린더 데이터 불러오기
  fetchCalendarData: async (organizationId, startDate, endDate) => {
    set({ isLoading: true })
    try {
      const data = await calendarService.getWorkCalendar(
        organizationId,
        startDate,
        endDate
      )
      useCalendarStore.getState().setCalendarData(data)
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))
