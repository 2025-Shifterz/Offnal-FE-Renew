import { create } from 'zustand'
import { useUserStore } from './useUserStore'
import { useCalendarStore } from './useCalendarStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  isLoggedIn: () => boolean
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
      isLoggedIn: () => !!get().refreshToken,

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
      logout: () => {
        const { clearUser } = useUserStore.getState()
        const { clearCalendarData } = useCalendarStore.getState()

        clearUser() // 유저 정보 초기화
        clearCalendarData() // 캘린더 데이터 초기화

        set({
          accessToken: null,
          refreshToken: null,
        })
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
