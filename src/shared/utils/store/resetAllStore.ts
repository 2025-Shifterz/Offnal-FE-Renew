import { useAuthStore } from '../../../store/useAuthStore'
import { useCalendarStore } from '../../../store/useCalendarStore'
import { useMemoStore } from '../../../store/useMemoStore'
import { useTodoStore } from '../../../store/useTodoStore'
import { useUserStore } from '../../../store/useUserStore'
import CookieManager from '@react-native-cookies/cookies'

/**
 * ## resetAllStore
 *
 * 모든 Zustand 스토어와 쿠키를 초기화하는 순수 유틸 함수로, Rules of Hooks을 회피하기 위한 함수
 *
 * ### 사용 예시
 * ```typescript
 * resetAllStore()
 * ```
 *
 * @returns {void}
 */
export const resetAllStore = () => {
  useAuthStore.getState().resetAllTokens()
  useUserStore.getState().clearUser()
  useCalendarStore.getState().clearCalendarData()
  useMemoStore.getState().deleteAllMemos()
  useTodoStore.getState().deleteAllTodos()
  CookieManager.removeSessionCookies()
  CookieManager.clearAll()
}
