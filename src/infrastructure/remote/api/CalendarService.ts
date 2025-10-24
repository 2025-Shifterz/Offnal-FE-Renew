import axios from 'axios'
import api from './axiosInstance'
import { CreateCalendarRequest } from '../request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../request/PatchWorkCalendarReqeust'
import { GetWorkCalendarResponse } from '../response/GetWorkCalendarResponse'

export class CalendarService {
  getWorkCalendar = async (
    organizationId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await api.get<GetWorkCalendarResponse>(
        '/works/calendar',
        {
          params: {
            organizationId,
            startDate,
            endDate,
          },
        }
      )

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      return []
    }
  }

  createWorkCalendar = async (
    organizationId: number,
    calendarData: CreateCalendarRequest
  ) => {
    try {
      const res = await api.post('/works/calendar', calendarData, {
        params: {
          organizationId,
        },
      })
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }

      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }

  deleteWorkCalendar = async (
    organizationId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const res = await api.delete(`/works/calendar`, {
        params: {
          organizationId,
          startDate,
          endDate,
        },
      })
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }

  updateWorkCalendar = async (
    organiztionId: number,
    startDate: string,
    endDate: string,
    shiftsData: UpdateShiftsRequest
  ) => {
    try {
      const res = await api.patch('/works/calendar', shiftsData, {
        params: {
          organiztionId,
          startDate,
          endDate,
        },
      })
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }
}
