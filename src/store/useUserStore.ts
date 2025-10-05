import { create } from 'zustand'

export interface User {
  nickname: string
  newMember: boolean
  profileUrl?: string
}

export interface UserState {
  user: User | null
  updateProfile: (profile: Partial<User>) => void
}

export const useUserStore = create<UserState>(set => ({
  user: null,

  // 프로필 업데이트 - nickName 또는 porfileUrl 필요한 필드만 업데이트
  // useAuthStore.getState().updateProfile({ profileUrl: 'https://example.com/image.png' }); 로 사용가능
  updateProfile: profile =>
    set(state => ({
      user: state.user ? { ...state.user, ...profile } : state.user,
    })),
}))
