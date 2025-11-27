import { create } from 'zustand'
import { useUserStore } from './useUserStore'
import { useCalendarStore } from './useCalendarStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'
import { authService } from '../infrastructure/di/Dependencies'
import appleAuth from '@invertase/react-native-apple-authentication'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  isLoggedIn: () => boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  loginWithApple: () => Promise<boolean | undefined>
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
      isLoggedIn: () => {
        const { accessToken, refreshToken } = get()
        return !!accessToken && !!refreshToken
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

      loginWithApple: async () => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          })

          const { user, email, fullName, identityToken } =
            appleAuthRequestResponse
          const credentialState =
            await appleAuth.getCredentialStateForUser(user)

          if (credentialState === appleAuth.State.AUTHORIZED) {
            if (!identityToken) {
              throw new Error('Identity Token is missing')
            }
            if (!user) {
              throw new Error('User is missing')
            }

            const response = await authService.loginWithApple(
              identityToken,
              user,
              email ?? null,
              fullName
                ? {
                    givenName: fullName.givenName ?? null,
                    familyName: fullName.familyName ?? null,
                  }
                : null
            )

            const { setUser } = useUserStore.getState()
            setUser({
              memberName: response.memberName,
              email: response.email,
              phoneNumber: response.phoneNumber,
              profileImageUrl: response.profileImageKey,
            })

            set({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            })

            return response.isNewMember
          }
        } catch (error) {
          console.error('Apple Login Failed', error)
        }
      },

      // 로그아웃 시
      logout: async () => {
        const { clearUser } = useUserStore.getState()
        const { clearCalendarData } = useCalendarStore.getState()

        clearUser() // 유저 정보 초기화
        clearCalendarData() // 캘린더 데이터 초기화
        set({
          accessToken: null,
          refreshToken: null,
        })

        await authService.tokenLogOut()
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
