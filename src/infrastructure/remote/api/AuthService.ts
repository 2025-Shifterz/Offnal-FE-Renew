import { PostLoginWithAppleResponse } from '../response/PostLoginWithAppleResponse'
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

  loginWithApple = async (
    identityToken: string,
    user: string | null,
    email: string | null,
    fullName: {
      givenName: string | null
      familyName: string | null
    } | null
  ) => {
    try {
      const response = await api.post<PostLoginWithAppleResponse>(
        '/login/apple',
        {
          identityToken,
          user,
          email,
          fullName,
        }
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
      const response = await api.post('/tokens/reissue', { refreshToken })
      console.log('/tokens/reissue 응답:', response)
      return response.data.data
    } catch (error) {
      console.error('/tokens/reissue API 요청 실패:', error)
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
