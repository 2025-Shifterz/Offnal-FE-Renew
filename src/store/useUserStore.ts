import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  memberRepository,
  memberService,
} from '../infrastructure/di/Dependencies'
import { User } from '../shared/types/User'
import EncryptedStorage from 'react-native-encrypted-storage'

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
        await memberRepository.updateUserProfile(
          name,
          image
            ? { url: image.uri, type: image.type, name: image.fileName }
            : undefined
        )

        const data = await memberService.getProfile()
        set(() => ({
          user: data,
        }))
      },
    }),
    { name: 'user-storage', storage: createJSONStorage(() => EncryptedStorage) }
  )
)
