import api from './axiosInstance'
import { noInterceptorApi } from './noIntercetorAxiosInstance'

export class AuthService {
  getLoginUrl = async () => {
    try {
      const response = await api.get('/login/page')
      return response.data.location
    } catch (error) {
      console.error('login/page API 요청 실패:', error)
    }
  }

  tokenReissue = async (refreshToken: string) => {
    try {
      const response = await api.post('/tokens/reissue', { refreshToken })
      console.log('/tokens/reissue 응답:', response.data)
      return response.data.data
    } catch (error: any) {
      console.error('/tokens/reissue API 요청 실패:', error)
      console.log('/tokens/reissue 응답:', error.response?.data)
      throw error
    }
  }

  tokenReissueWithNoInterceptor = async (refreshToken: string) => {
    try {
      // 인터셉터 없는 axios 인스턴스 사용
      const response = await noInterceptorApi.post('/tokens/reissue', {
        refreshToken,
      })
      console.log('/tokens/reissue (no interceptor) 응답:', response.data)
      return response.data.data
    } catch (error: any) {
      console.error('/tokens/reissue (no interceptor) API 요청 실패:', error)
      console.log(
        '/tokens/reissue (no interceptor) 응답:',
        error.response?.data
      )

      throw error
    }
  }

  tokenLogOut = async () => {
    try {
      await api.post('/tokens/logout')
    } catch (error) {
      throw error
    }
  }
}
