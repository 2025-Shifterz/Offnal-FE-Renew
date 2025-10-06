import axios from 'axios'
import api from './axiosInstance'
import { GetProfileResponse } from '../response/GetProfileResponse'
import { PatchProfileRequest } from '../request/PatchProfileRequest'

export class ProfileService {
  getProfile = async () => {
    try {
      const response = await api.get<GetProfileResponse>('/members/profile')
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  updateProfile = async (profileData: PatchProfileRequest) => {
    try {
      const response = await api.patch<PatchProfileRequest>(
        '/members/profile',
        profileData
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
