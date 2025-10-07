import { create } from 'zustand'

interface User {
  nickname: string
  newMember: boolean
  profileUrl?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean

  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  updateProfile: (profile: Partial<User>) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,

  // 로그인 시
  login: (user, accessToken, refreshToken) =>
    set({
      user,
      accessToken,
      refreshToken,
      isLoggedIn: true,
    }),

  // 로그아웃 시
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    }),

  // 토큰만 업데이트
  setAccessToken: token => set(state => ({ ...state, accessToken: token })),
  setRefreshToken: token => set(state => ({ ...state, refreshToken: token })),

  // 프로필 업데이트 - nickName 또는 porfileUrl 필요한 필드만 업데이트
  // useAuthStore.getState().updateProfile({ profileUrl: 'https://example.com/image.png' }); 로 사용가능
  updateProfile: profile =>
    set(state => ({
      user: state.user ? { ...state.user, ...profile } : state.user,
    })),
}))
