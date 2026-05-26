import { PostLoginWithAppleRequest } from '../request/PostLoginWithAppleRequest'
import { PostLoginWithAppleResponse } from '../response/PostLoginWithAppleResponse'
import { PostLoginWithKakaoRequest } from '../request/PostLoginWithKakaoRequest'
import { PostLoginWithKakaoResponse } from '../response/PostLoginWithKakaoResponse'
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

  loginWithKakao = async (requestDto: PostLoginWithKakaoRequest) => {
    try {
      const response = await apiAxiosClient.post<PostLoginWithKakaoResponse>(
        '/login/kakao',
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
      if (__DEV__) {
        console.log(
          `/tokens/reissue (${instanceName}) status:`,
          response.status
        )
      }
      return response.data.data
    } catch (error: unknown) {
      const responseError = error as { response?: { status?: number } }
      console.error(`/tokens/reissue (${instanceName}) API 요청 실패:`, {
        status: responseError.response?.status,
      })
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
