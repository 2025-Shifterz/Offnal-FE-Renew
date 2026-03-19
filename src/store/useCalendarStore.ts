// 어떤 한 달의 근무 일정 상태
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  WorkType,
  DateAndWorkType,
  DateAndWorkTypeRecord,
} from '../shared/types/Calendar'
import dayjs from 'dayjs'
import { calendarRepository } from '../infrastructure/di/Dependencies'
import { useScheduleInfoStore } from './useScheduleInfoStore'

/*
<---- calendarData 형태 ----> 

const calendarData: DateAndWorkTypeRecord = {
  "2025-09-01": { workTypeName: "오후" },
  "2025-09-02": { workTypeName: "휴일" },
}
*/

interface CalendarState {
  calendarData: DateAndWorkTypeRecord
  selectedDate: dayjs.Dayjs | null

  isLoading: boolean

  // 편집용
  newCalendarData: DateAndWorkTypeRecord

  // setter
  setCalendarData: (data: DateAndWorkType[]) => void
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  updateCalendarDay: (date: string, workTypeName: WorkType) => void
  clearCalendarData: () => void
  setLoading: (loading: boolean) => void

  // 온보딩 캘린더 편집용 - CalendarEditor 에서 쓰임
  setNewCalendarData: (data: DateAndWorkTypeRecord) => void
  updateNewCalendarDay: (date: string, workTypeName: WorkType) => void
  clearNewCalendarData: () => void

  // fetch
  fetchCalendarData: (
    organizationName: string,
    team: string,
    startDate: string,
    endDate: string
  ) => Promise<void>
}

export const useCalendarStore = create<CalendarState>()(
  immer(set => ({
    calendarData: {},
    newCalendarData: {},
    selectedDate: null,
    selectedYearMonth: {
      year: dayjs().year(),
      month: dayjs().month() + 1,
    },
    currentYearMonth: {
      year: dayjs().year(),
      month: dayjs().month() + 1,
      // TODO: currentDate를 현재 달 대신에 선택된 달로 바꿔야 함!!!
      currentStartDate: dayjs().startOf('month').format('YYYY-MM-DD'), // ✅
      currentEndDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    },
    isLoading: false,

    setCalendarData: data =>
      set(() => {
        const mapped: DateAndWorkTypeRecord = {}
        data.forEach(item => {
          mapped[item.date] = {
            workTypeName: item.workTypeName,
            startTime: item.startTime,
            endTime: item.endTime,
          }
        })
        return { calendarData: mapped }
      }),
    setNewCalendarData: data => set({ newCalendarData: data }),

    // 특정 날짜의 근무 형태 수정
    updateCalendarDay: (date, workTypeName) =>
      set(state => {
        const existing = state.calendarData[date]?.workTypeName
        if (existing === workTypeName) {
          delete state.calendarData[date]
        } else {
          state.calendarData[date] = { workTypeName }
        }
      }),
    updateNewCalendarDay: (date, workTypeName) =>
      set(state => {
        const existing = state.newCalendarData[date]?.workTypeName
        if (existing === workTypeName) {
          delete state.newCalendarData[date]
        } else {
          state.newCalendarData[date] = { workTypeName }
        }
      }),

    setSelectedDate: date => set({ selectedDate: date }),

    // 캘린더 데이터 전체 삭제
    clearCalendarData: () => set({ calendarData: {} }),
    clearNewCalendarData: () => set({ newCalendarData: {} }),

    setLoading: loading => set({ isLoading: loading }),

    // 서버에서 캘린더 데이터 불러오기 & 데이터 저장
    fetchCalendarData: async (organizationName, team, startDate, endDate) => {
      set({ isLoading: true })
      try {
        const data = await calendarRepository.getCalendar(
          organizationName,
          team,
          startDate,
          endDate
        )

        useCalendarStore.getState().setCalendarData(data)
        console.log('Fetched calendar data:', data)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
      } finally {
        set({ isLoading: false })
      }
      try {
        await useScheduleInfoStore
          .getState()
          .fetchScheduleInfo(organizationName, team)
      } catch (e) {
        console.error('scheduleInfo fetch failed', e)
      }
    },
  }))
)
