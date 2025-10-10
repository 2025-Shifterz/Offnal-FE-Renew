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

  tokenReissue = async (refreshToken: string) => {
    try {
      const response = await api.post('/tokens/reissue', { refreshToken })
      return response.data.data
    } catch (error) {
      console.error('/tokens/reissue API 요청 실패:', error)
      throw error
    }
  }
}
