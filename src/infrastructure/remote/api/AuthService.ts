import { PostLoginWithAppleRequest } from '../request/PostLoginWithAppleRequest'
import { PostLoginWithAppleResponse } from '../response/PostLoginWithAppleResponse'
import { baseAxiosClient } from '../axios/createBaseAxiosClient'
import { apiAxiosClient } from '../axios/createApiAxiosClient'

export class AuthService {
  getLoginUrl = async () => {
    try {
      const response = await apiAxiosClient.get('/login/page')
      return response.data.location
    } catch (error) {
      console.error('login/page API 요청 실패:', error)
    }
  }

  loginWithApple = async (requestDto: PostLoginWithAppleRequest) => {
    try {
      const response = await apiAxiosClient.post<PostLoginWithAppleResponse>(
        '/login/apple',
        requestDto
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  // private
  private tokenReissueHelper = async (
    axiosInstance: typeof apiAxiosClient,
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
    return this.tokenReissueHelper(
      apiAxiosClient,
      refreshToken,
      'with interceptor'
    )
  }

  tokenReissueWithNoInterceptor = async (refreshToken: string) => {
    return this.tokenReissueHelper(
      baseAxiosClient,
      refreshToken,
      'no interceptor'
    )
  }

  tokenLogOut = async () => {
    try {
      await apiAxiosClient.post('/tokens/logout')
    } catch (error) {
      throw error
    }
  }
}
