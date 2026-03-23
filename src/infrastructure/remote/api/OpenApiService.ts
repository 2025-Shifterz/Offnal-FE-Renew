import { OPEN_API_SERVICE_KEY } from '@env'
import { openApiAxiosClient } from '../axios/createAxiosClient'
import {
  GetRestDeInfoResponse,
  SerializedGetRestDeInfoResponse,
} from '../response/GetRestDeInfoResponse'
import dayjs from 'dayjs'

/**
 * ## OpenApiService
 * 공공 데이터 API를 호출하는 서비스
 *
 * - 한국천문연구원_특일 정보 (공휴일)
 */
export class OpenApiService {
  getRestDeInfo = async (
    solYear: string = dayjs().year().toString()
  ): Promise<SerializedGetRestDeInfoResponse> => {
    const response = await openApiAxiosClient.get<GetRestDeInfoResponse>(
      '/getRestDeInfo',
      {
        params: {
          serviceKey: OPEN_API_SERVICE_KEY,
          solYear: solYear,
          _type: 'json',
          numOfRows: 100,
        },
      }
    )

    return response.data.response
  }
}
