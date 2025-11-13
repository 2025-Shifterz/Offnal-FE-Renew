import axios from 'axios'
import api from './axiosInstance'
import { CreateCalendarRequest } from '../request/CreateWorkCalendarRequest'
import { UpdateShiftsRequest } from '../request/PatchWorkCalendarReqeust'
import {
  GetWorkCalendarResponse,
  GetWorkCalendarResponseData,
} from '../response/GetWorkCalendarResponse'

export class CalendarService {
  getWorkCalendar = async (
    organizationName: string,
    team: string,
    startDate: string,
    endDate: string
  ): Promise<GetWorkCalendarResponseData[]> => {
    try {
      const response = await api.get<GetWorkCalendarResponse>(
        '/works/calendar',
        {
          params: {
            organizationName,
            team,
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

  createWorkCalendar = async (calendarData: CreateCalendarRequest) => {
    try {
      const response = await api.post('/works/calendar', calendarData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }

      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }

  deleteWorkCalendar = async (organizationName: string, team: string) => {
    try {
      const response = await api.delete(`/works/calendar`, {
        params: {
          organizationName,
          team,
        },
      })
      return response.data
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
    organizationName: string,
    team: string,
    shiftsData: UpdateShiftsRequest
  ) => {
    try {
      const response = await api.patch('/works/calendar', shiftsData, {
        params: {
          organizationName,
          team,
        },
      })
      return response.data
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
