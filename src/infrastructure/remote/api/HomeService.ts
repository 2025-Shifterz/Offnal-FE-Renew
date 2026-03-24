import axios from 'axios'
import { GetScheduleResponse } from '../response/GetScheduleResponse'
import { GetRoutineResponse } from '../response/GetRoutineResponse'
import { apiAxiosClient } from '../axios/createApiAxiosClient'

export class HomeService {
  getSchedule = async () => {
    try {
      const response =
        await apiAxiosClient.get<GetScheduleResponse>('/home/schedule')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  getRoutine = async () => {
    try {
      const response =
        await apiAxiosClient.get<GetRoutineResponse>('/home/routine')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  getRoutineByDate = async (date: string) => {
    try {
      const response = await apiAxiosClient.get<GetRoutineResponse>(
        `/home/routine/${date}`
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }
}
