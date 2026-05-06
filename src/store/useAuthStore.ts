import { create } from 'zustand'
import { useUserStore } from './useUserStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'
import { authService } from '../infrastructure/di/Dependencies'
import { appleAuth } from '@invertase/react-native-apple-authentication'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  isLoggedIn: () => Promise<boolean>
  login: (user: User, accessToken: string, refreshToken: string) => void
  loginWithApple: () => Promise<boolean>

  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void

  resetAllTokens: () => void
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
          // 기존 api instance 사용 금지 - 요청 인터셉터에서 다시 토큰 재발급하므로 무한 루프 발생
          const res =
            await authService.tokenReissueWithNoInterceptor(refreshToken)
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

      loginWithApple: async () => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          })

          const { identityToken, authorizationCode, user, email, fullName } =
            appleAuthRequestResponse

          if (!identityToken) {
            throw new Error('Apple Identity Token is missing')
          }

          const res = await authService.loginWithApple({
            identityToken,
            authorizationCode: authorizationCode ?? '',
            user: user ?? '',
            email: email ?? '',
            fullName: {
              givenName: fullName?.givenName ?? '',
              familyName: fullName?.familyName ?? '',
            },
          })

          const { setUser } = useUserStore.getState()
          setUser({
            memberName: res.memberName,
            email: res.email,
            phoneNumber: res.phoneNumber,
            profileImageUrl: res.profileImageKey,
          })

          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })

          return res.newMember
        } catch (error) {
          throw error
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

      // 토큰만 업데이트
      setAccessToken: token => set(state => ({ ...state, accessToken: token })),
      setRefreshToken: token =>
        set(state => ({ ...state, refreshToken: token })),

      resetAllTokens: () => set({ accessToken: null, refreshToken: null }),
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
