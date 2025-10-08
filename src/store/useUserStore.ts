import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { profileService } from '../infrastructure/di/Dependencies'
import { User } from '../shared/types/User'

export interface UserState {
  user: User | null

  // setter
  setUser: (user: User) => void
  clearUser: () => void

  // fetch
  fetchProfile: () => Promise<void>
  updateProfile: (profile: User) => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,

      setUser: user => set({ user }),

      clearUser: () => set({ user: null }),

      fetchProfile: async () => {
        const data = await profileService.getProfile()
        set(() => ({
          user: data,
        }))
      },

      updateProfile: async (profile: User) => {
        const data = await profileService.updateProfile(profile)
        set(() => ({
          user: data,
        }))
      },
    }),
    { name: 'user-storage' }
  )
)
