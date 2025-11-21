import axios from 'axios'
import api from './axiosInstance'
import {
  GetTeamWorkCalendarResponse,
  GetTeamWorkCalendarResponseData,
} from '../response/GetTeamWorkCalendarResponse'
import { UpdateTeamShiftsRequest } from '../request/PatchTeamWorkCalendarRequest'

export class TeamCalendarService {
  // organizationName이 같은 조직들의 근무 일정 조회
  getTeamWorkCalendar = async (
    organizationName: string,
    startDate: string,
    endDate: string
  ): Promise<GetTeamWorkCalendarResponseData> => {
    try {
      const response = await api.get<GetTeamWorkCalendarResponse>(
        `works/calendar/organizations/${organizationName}/work-instances`,
        {
          params: {
            organizationName,
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
      return Promise.reject(error)
    }
  }

  updateTeamWorkCalendar = async (
    organizationName: string,
    teamShiftsData: UpdateTeamShiftsRequest
  ) => {
    try {
      const response = await api.patch('works/calendar/group', {
        teamShiftsData,
        params: {
          organizationName,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      return Promise.reject(error)
    }
  }
}
