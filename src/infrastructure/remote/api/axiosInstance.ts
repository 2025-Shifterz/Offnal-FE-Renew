import axios from 'axios'
import EncryptedStorage from 'react-native-encrypted-storage'
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

// 갱신 직후 큐에 있는 요청들 처리
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
        // 이미 갱신 중이면 큐에 대기
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

      isRefreshing = true
      try {
        //const refreshToken = await EncryptedStorage.getItem('refreshToken')
        const refreshToken = useAuthStore.getState().refreshToken
        const data = await authService.tokenReissue(refreshToken!)
        console.log('/tokens/reissue 응답:', data)
        const { accessToken: newToken, refreshToken: newRefreshToken } = data

        // 새 토큰 저장
        //await EncryptedStorage.setItem('accessToken', newToken)
        //await EncryptedStorage.setItem('refreshToken', newRefreshToken)
        useAuthStore.getState().setAccessToken(newToken)
        useAuthStore.getState().setRefreshToken(newRefreshToken)

        // 큐 처리
        processQueue(null, newToken)

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)

        // refreshToken 으로 재발급 시도했으나 실패한 경우
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
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
