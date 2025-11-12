// 어떤 한 달의 근무 일정 상태
import { create } from 'zustand'
import {
  WorkType,
  DateAndWorkType,
  DateAndWorkTypeRecord,
} from '../shared/types/Calendar'
import dayjs from 'dayjs'
import { calendarService } from '../infrastructure/di/Dependencies'
import { createJSONStorage, persist } from 'zustand/middleware'
import EncryptedStorage from 'react-native-encrypted-storage'

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
  currentYearMonth: {
    year: number
    month: number
    currentStartDate: string
    currentEndDate: string
  }
  isLoading: boolean
  organizationName: string
  team: string

  // userCalendar
  userCalendar: {
    organizationName: string
    team: string
  }

  // setter
  setOrganizationName: (name: string) => void
  setTeam: (team: string) => void
  setCalendarData: (data: DateAndWorkType[]) => void
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  setCurrentYearMonth: (year: number, month: number) => void
  updateCalendarDay: (date: string, workTypeName: WorkType) => void
  clearCalendarData: () => void
  setLoading: (loading: boolean) => void
  setUserCalendar: (organizationName: string, team: string) => void

  // fetch
  fetchCalendarData: (
    organizationName: string,
    team: string,
    startDate: string,
    endDate: string
  ) => Promise<void>
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      calendarData: {},
      selectedDate: null,
      currentYearMonth: {
        year: dayjs().year(),
        month: dayjs().month() + 1,
        // TODO: currentDate를 현재 달 대신에 선택된 달로 바꿔야 함!!!
        currentStartDate: dayjs().startOf('month').format('YYYY-MM-DD'), // ✅
        currentEndDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      },
      isLoading: false,
      organizationName: '',
      team: '',

      userCalendar: {
        organizationName: '',
        team: '',
        // startDate: '',
        // endDate: '',
      },

      setOrganizationName: name => set({ organizationName: name }),

      setTeam: team => set({ team }),

      setCalendarData: data =>
        set(() => {
          const mapped: DateAndWorkTypeRecord = {}
          data.forEach(item => {
            mapped[item.date] = {
              workTypeName: item.workTypeName,
              startTime: item.startTime,
              duration: item.duration,
            }
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

      setCurrentYearMonth: (year, month) => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')
        set({
          currentYearMonth: {
            year,
            month,
            currentStartDate: startDate,
            currentEndDate: endDate,
          },
        })
      },

      setSelectedDate: date => set({ selectedDate: date }),

      // 캘린더 데이터 전체 삭제
      clearCalendarData: () => set({ calendarData: {} }),

      setLoading: loading => set({ isLoading: loading }),

      // 서버에서 캘린더 데이터 불러오기
      fetchCalendarData: async (organizationName, team, startDate, endDate) => {
        set({ isLoading: true })
        try {
          const data = await calendarService.getWorkCalendar(
            organizationName,
            team,
            startDate,
            endDate
          )

          const mapped: DateAndWorkType[] = data.map(item => ({
            date: item.date,
            workTypeName: item.workTypeName,
            startTime: item.startTime ?? '',
            duration: item.duration ?? '',
          }))

          useCalendarStore.getState().setCalendarData(mapped)
        } catch (error) {
          console.error('Error fetching calendar data:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      setUserCalendar: (organizationName, team) =>
        set({ userCalendar: { organizationName, team } }),
    }),

    {
      name: 'calendar-storage', // 이름 지정
      storage: createJSONStorage(() => EncryptedStorage),
      partialize: state => ({
        organizationName: state.organizationName,
        team: state.team,
        userCalendar: state.userCalendar,
      }),
    }
  )
)
