import axios from 'axios'
import EncryptedStorage from 'react-native-encrypted-storage'
import { API_URL } from '@env'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// 요청 인터셉터
api.interceptors.request.use(
  async config => {
    const token = await EncryptedStorage.getItem('accessToken')
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
let isRefreshing = false
let failedQueue: any[] = []

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
        const refreshToken = await EncryptedStorage.getItem('refreshToken')
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken: newToken } = res.data

        // 새 토큰 저장
        await EncryptedStorage.setItem('accessToken', newToken)

        // 큐 처리
        processQueue(null, newToken)

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        // TODO: 로그아웃 처리 필요
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
