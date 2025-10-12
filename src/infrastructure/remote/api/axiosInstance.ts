import axios from 'axios'
import { API_URL } from '@env'
import { useAuthStore } from '../../../store/useAuthStore'
import { authService } from '../../di/Dependencies'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터: 401 에러 시 refreshToken으로 요청 보내서 accessToken 갱신
let isRefreshing = false // 토큰 갱신 중인지 여부
let failedQueue: any[] = [] // 갱신 중에 들어온 요청들을 저장하는 큐

// 토큰 재발급이 완료되면, 큐에 있던 요청들에게 새 토큰을 전달
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // accessToken 만료 시
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        // 이미 누군가 토큰을 갱신 중이면 나머지는 큐에 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject: (err: any) => reject(err),
          })
        })
      }

      // 재발급 API 호출 - accessToken, refreshToken 갱신
      isRefreshing = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const data = await authService.tokenReissue(refreshToken!)
        console.log('/tokens/reissue 응답:', data)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          data

        // 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken)
        useAuthStore.getState().setRefreshToken(newRefreshToken)

        // 대기 중이던 요청들에 새 토큰 전달
        processQueue(null, newAccessToken)

        // 원래 실패했던 요청 다시 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        // 재발급 시도했으나 실패한 경우
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        processQueue(err, null)
        console.log('토큰 재발급 실패:', err)
        useAuthStore.getState().logout()

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
