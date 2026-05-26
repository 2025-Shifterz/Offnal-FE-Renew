// 어떤 한 달의 근무 일정 상태
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  ShiftType,
  DateAndShiftType,
  DateAndShiftTypeRecord,
} from '../shared/types/Calendar'
import dayjs from 'dayjs'
import { calendarRepository } from '../infrastructure/di/Dependencies'
import { useScheduleInfoStore } from './useScheduleInfoStore'

/**
 * ### CalendarState
 *
 * 이 인터페이스는 한 달의 근무 일정 상태를 나타냅니다.
 *
 * @property calendarData - "YYYY-MM-DD" 형식의 날짜 문자열을 키로 하고, `ShiftTypeInfo` 객체를 값으로 가지는 매핑 객체입니다.
 * @property selectedDate - 선택된 날짜를 나타내는 `dayjs.Dayjs` 객체입니다.
 * @property isLoading - 캘린더 데이터 로딩 상태를 나타내는 불리언 값입니다.
 * @property newCalendarData - 편집용 캘린더 데이터입니다.
 *
 * @remarks
 * 이 인터페이스는 `CalendarEditor` 컴포넌트와 `Calendar` 컴포넌트에서 사용됩니다.
 *
 * @example
 * ```
 * const calendarState: CalendarState = {
 *  calendarData: <DateAndShiftTypeRecord> {
 *    "2025-09-01": { shiftTypeName: "오후" },
 *    "2025-09-02": { shiftTypeName: "휴일" },
 *  },
 *  selectedDate: dayjs("2025-09-01"),
 *  isLoading: false,
 *  newCalendarData: {},
 *  setCalendarData: () => {},
 *  setSelectedDate: () => {},
 *  updateCalendarDay: () => {},
 *  clearCalendarData: () => {},
 *  setLoading: () => {},
 *  setNewCalendarData: () => {},
 *  updateNewCalendarDay: () => {},
 *  clearNewCalendarData: () => {},
 *  fetchCalendarData: () => Promise.resolve(),
 * }
 * ```
 *
 */
interface CalendarState {
  calendarData: DateAndShiftTypeRecord
  selectedDate: dayjs.Dayjs | null

  isLoading: boolean

  // 편집용
  newCalendarData: DateAndShiftTypeRecord

  // setter
  setCalendarData: (data: DateAndShiftType[]) => void
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  updateCalendarDay: (date: string, shiftType: ShiftType) => void
  clearCalendarData: () => void
  setLoading: (loading: boolean) => void

  // 온보딩 캘린더 편집용 - CalendarEditor 에서 쓰임
  setNewCalendarData: (data: DateAndShiftTypeRecord) => void
  updateNewCalendarDay: (date: string, shiftType: ShiftType) => void
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
        const mapped: DateAndShiftTypeRecord = {}
        data.forEach(item => {
          mapped[item.date] = {
            shiftTypeName: item.shiftTypeName,
            startTime: item.startTime,
            endTime: item.endTime,
          }
        })
        return { calendarData: mapped }
      }),
    setNewCalendarData: data => set({ newCalendarData: data }),

    // 특정 날짜의 근무 형태 수정
    updateCalendarDay: (date, shiftType) =>
      set(state => {
        const existing = state.calendarData[date]?.shiftTypeName
        if (existing === shiftType) {
          delete state.calendarData[date]
        } else {
          state.calendarData[date] = { shiftTypeName: shiftType }
        }
      }),
    updateNewCalendarDay: (date, shiftType) =>
      set(state => {
        const existing = state.newCalendarData[date]?.shiftTypeName
        if (existing === shiftType) {
          delete state.newCalendarData[date]
        } else {
          state.newCalendarData[date] = { shiftTypeName: shiftType }
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
