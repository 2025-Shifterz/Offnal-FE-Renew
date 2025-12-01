import api from './axiosInstance'
import { noInterceptorApi } from './noInterceptorAxiosInstance'

export class AuthService {
  getLoginUrl = async () => {
    try {
      const response = await api.get('/login/page')
      return response.data.location
    } catch (error) {
      console.error('login/page API 요청 실패:', error)
    }
  }

  // private
  private tokenReissueHelper = async (
    axiosInstance: typeof api,
    refreshToken: string,
    instanceName: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const response = await axiosInstance.post('/tokens/reissue', {
        refreshToken,
      })
      console.log(`/tokens/reissue (${instanceName}) 응답:`, response.data)
      return response.data.data
    } catch (error: any) {
      console.error(`/tokens/reissue (${instanceName}) API 요청 실패:`, error)
      console.log(
        `/tokens/reissue (${instanceName}) 응답:`,
        error.response?.data
      )
      throw error
    }
  }

  tokenReissue = async (refreshToken: string) => {
    return this.tokenReissueHelper(api, refreshToken, 'with interceptor')
  }

  tokenReissueWithNoInterceptor = async (refreshToken: string) => {
    return this.tokenReissueHelper(
      noInterceptorApi,
      refreshToken,
      'no interceptor'
    )
  }

  tokenLogOut = async () => {
    try {
      await api.post('/tokens/logout')
    } catch (error) {
      throw error
    }
  }
}
