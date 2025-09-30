import api from './axiosInstance'
import axios from 'axios'
import { HomeResponse } from '../response/homeResponse'

export class HomeService {
  getHome = async () => {
    try {
      const response = await api.get<HomeResponse>('/home')
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code
        if (errorCode === 'WORK_INSTANCE_NOT_FOUND') {
          console.warn('해당 일자에 근무 정보가 없음')
          return null
        }
        console.error(
          '홈 API 요청 실패:',
          error.response?.data || error.message
        )
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }
}
