import { PostLoginWithAppleRequest } from '../request/PostLoginWithAppleRequest'
import { PostLoginWithAppleResponse } from '../response/PostLoginWithAppleResponse'
import { PostRefreshTokenResponse } from '../response/PostRefreshTokenResponse'
import api from './axiosInstance'

export class AuthService {
  getLoginUrl = async () => {
    try {
      const response = await api.get('/login/page')
      return response.data.location
    } catch (error) {
      console.error('login/page API 요청 실패:', error)
    }
  }

  loginWithApple = async (requestDto: PostLoginWithAppleRequest) => {
    console.log('loginWithApple requestDto:', requestDto)
    console.log('loginWithApple requestDto fullName:', requestDto.fullName)

    try {
      const response = await api.post<PostLoginWithAppleResponse>(
        '/login/apple',
        requestDto
      )
      console.log('/login/apple 응답:', response)
      return response.data.data
    } catch (error) {
      console.error('/login/apple API 요청 실패:', error)
      throw error
    }
  }

  tokenReissue = async (refreshToken: string) => {
    try {
      console.log('refreshToken:', refreshToken)

      const response = await api.post<PostRefreshTokenResponse>(
        '/tokens/reissue',
        { refreshToken }
      )
      console.log('/tokens/reissue 응답:', response)
      return response.data.data
    } catch (error) {
      // console.error('/tokens/reissue API 요청 실패:', error)
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
