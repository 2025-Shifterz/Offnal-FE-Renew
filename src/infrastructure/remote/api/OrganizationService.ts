import axios from 'axios'
import api from './axiosInstance'
import {
  GetAllOrganizationsResponse,
  GetAllOrganizationsResponseData,
} from '../response/GetAllOrganizationsResponse'

export class OrganizationService {
  getAllOrganizations = async (): Promise<
    GetAllOrganizationsResponseData[]
  > => {
    try {
      const response =
        await api.get<GetAllOrganizationsResponse>(`/organizations`)
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
}
