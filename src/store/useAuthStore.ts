import { create } from 'zustand'
import { useUserStore } from './useUserStore'
import { useCalendarStore } from './useCalendarStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'
import { authService } from '../infrastructure/di/Dependencies'
import CookieManager from '@react-native-cookies/cookies'
import { appleAuth } from '@invertase/react-native-apple-authentication'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  isLoggedIn: () => Promise<boolean>
  login: (user: User, accessToken: string, refreshToken: string) => void
  loginWithApple: () => Promise<boolean>

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

      loginWithApple: async () => {
        console.log('loginWithApple started')
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          })

          console.log('appleAuthRequestResponse:', appleAuthRequestResponse)

          const { identityToken, authorizationCode, user, email, fullName } =
            appleAuthRequestResponse

          if (!identityToken) {
            throw new Error('Apple Identity Token is missing')
          }

          console.log('Calling authService.loginWithApple...')
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
          console.log('authService.loginWithApple response:', res)

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
          console.error('Apple Login Failed:', error)
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
