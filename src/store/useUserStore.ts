import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  memberRepository,
  memberService,
} from '../infrastructure/di/Dependencies'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useCalendarStore } from './useCalendarStore'
import { localMemoStore } from './useLocalMemoStore'

export interface UserState {
  user: User | null

  // setter
  setUser: (user: User) => void
  clearUser: () => void

  // fetch
  fetchProfile: () => Promise<void>

  updateProfile: (
    name: string,
    image?: {
      uri: string
      type: string
      fileName: string
    } | null
  ) => Promise<void>

  // withdraw
  onWithdraw: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,

      setUser: user => set({ user }),

      clearUser: () => set({ user: null }),

      fetchProfile: async () => {
        const data = await memberService.getProfile()
        set(() => ({
          user: data,
        }))
      },

      updateProfile: async (
        name: string,
        image?: {
          uri: string
          type: string
          fileName: string
        } | null
      ) => {
        await memberRepository.updateUserProfile(name, {
          url: image?.uri ?? '',
          type: image?.type ?? '',
          name: image?.fileName ?? '',
        })

        const data = await memberService.getProfile()
        set(() => ({
          user: data,
        }))
      },

      onWithdraw: async () => {
        await memberRepository.withDrawMember()

        const { clearCalendarData } = useCalendarStore.getState()
        const { deleteAllMemos } = localMemoStore.getState()

        clearCalendarData()
        deleteAllMemos()

        set(() => ({ user: null }))
      },
    }),
    { name: 'user-storage', storage: createJSONStorage(() => EncryptedStorage) }
  )
)
