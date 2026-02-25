import { useCallback } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useCalendarStore } from '../../store/useCalendarStore'
import { useMemoStore } from '../../store/useMemoStore'
import { useTodoStore } from '../../store/useTodoStore'
import { useUserStore } from '../../store/useUserStore'
import CookieManager from '@react-native-cookies/cookies'

/**
 * ## useResetAllStore
 *
 * 모든 Zustand 스토어와 쿠키를 초기화하는 훅
 * useCallback을 사용해서 react 훅 구성
 *
 * ### 사용 예시
 * ```typescript
 * const { resetAll } = useResetAllStore()
 * resetAll()
 * ```
 *
 * ### 사용 유스케이스
 *  1. 로그아웃 시
 *  2. 회원 탈퇴 시
 *
 * @returns resetAll 함수
 */
export const useResetAllStore = () => {
  const { resetAllTokens } = useAuthStore.getState()

  const { clearUser } = useUserStore.getState()
  const { clearCalendarData } = useCalendarStore.getState()

  const { deleteAllMemos } = useMemoStore.getState()
  const { deleteAllTodos } = useTodoStore.getState()

  const resetAll = useCallback(async () => {
    // 1. Zustand 스토어 초기화
    resetAllTokens()
    clearUser()
    clearCalendarData()
    deleteAllMemos()
    deleteAllTodos()

    // 2. Cookie 초기화
    await CookieManager.removeSessionCookies()
    await CookieManager.clearAll()
  }, [
    resetAllTokens,
    clearUser,
    clearCalendarData,
    deleteAllMemos,
    deleteAllTodos,
  ])

  return { resetAll }
}
