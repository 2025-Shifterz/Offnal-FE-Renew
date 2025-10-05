import { create } from 'zustand'
import { User, useUserStore } from './useUserStore'
import { useCalendarStore } from './useCalendarStore'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean

  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,

  // 로그인 시
  login: (user, accessToken, refreshToken) => {
    const { updateProfile } = useUserStore.getState()
    updateProfile(user)

    set({
      accessToken,
      refreshToken,
      isLoggedIn: true,
    })
  },
  // 로그아웃 시
  logout: () => {
    const { updateProfile } = useUserStore.getState()
    const { clearCalendarData } = useCalendarStore.getState()

    updateProfile({ nickname: '', newMember: false, profileUrl: undefined })
    clearCalendarData() // 캘린더 데이터 초기화

    set({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    })
  },

  // 토큰만 업데이트
  setAccessToken: token => set(state => ({ ...state, accessToken: token })),
  setRefreshToken: token => set(state => ({ ...state, refreshToken: token })),
}))
