import { create } from 'zustand'
import { useUserStore } from './useUserStore'
import { useCalendarStore } from './useCalendarStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'
import { authService } from '../infrastructure/di/Dependencies'
import CookieManager from '@react-native-cookies/cookies'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  isLoggedIn: () => Promise<boolean>
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,

      // 로그인 여부
      isLoggedIn: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) return false

        try {
          const res = await authService.tokenReissue(refreshToken)
          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
          return true
        } catch (error) {
          console.error('Token reissue failed:', error)
          return false
        }
      },

      // 로그인 시
      login: (user, accessToken, refreshToken) => {
        // 유저 정보 설정
        const { setUser } = useUserStore.getState()
        setUser({
          memberName: user.memberName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profileImageUrl: user.profileImageUrl,
        })

        set({
          accessToken,
          refreshToken,
        })
      },
      // 로그아웃 시
      logout: async () => {
        const { clearUser } = useUserStore.getState()
        const { clearCalendarData } = useCalendarStore.getState()
        await authService.tokenLogOut()

        clearUser()
        clearCalendarData()
        set({
          accessToken: null,
          refreshToken: null,
        })

        await CookieManager.removeSessionCookies()
        await CookieManager.clearAll()
      },

      // 토큰만 업데이트
      setAccessToken: token => set(state => ({ ...state, accessToken: token })),
      setRefreshToken: token =>
        set(state => ({ ...state, refreshToken: token })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => EncryptedStorage),
      partialize: state => ({
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
      }),
    }
  )
)
