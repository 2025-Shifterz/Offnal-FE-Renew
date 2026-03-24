import {
  GetScheduleInfoResponse,
  GetScheduleInfoResponseData,
} from '../response/GetScheduleInfoResponse'
import { apiAxiosClient } from '../axios/createApiAxiosClient'

// workTimes(D/E/N/-)을 조회하는 API
export class ScheduleInfoService {
  getScheduleInfo = async (
    organizationName: string,
    workGroup: string
  ): Promise<GetScheduleInfoResponseData> => {
    try {
      const response = await apiAxiosClient.get<GetScheduleInfoResponse>(
        `/works/calendar/organizations/${organizationName}/teams/${workGroup}/calendars`
      )
      return response.data.data[0]
    } catch (error) {
      console.error('API 요청 실패:', error)
      throw error
    }
  }
}
