import EncryptedStorage from 'react-native-encrypted-storage'
import { UserProfile } from '../model/UserProfile'
import { UserRepository } from '../../domain/repositories/UserRepository'
import { homeService } from '../../infrastructure/di/Dependencies'

export class UserRepositoryImpl implements UserRepository {
  async isUserScheduleRegistered(): Promise<boolean> {
    const result = await homeService.getHome().then(
      data => {
        if (data != null) {
          return true
        } else {
          return false
        }
      },
      error => {
        return false
      }
    )

    return result
  }

  async initUserData(
    accessToken: string,
    refreshToken: string,
    name: string
  ): Promise<void> {
    try {
      await EncryptedStorage.setItem('accessToken', accessToken)
      await EncryptedStorage.setItem('refreshToken', refreshToken)

      const userProfile: UserProfile = { name: name, imageUrl: '' }

      await EncryptedStorage.setItem(
        'user_profile',
        JSON.stringify(userProfile)
      )
    } catch (error) {
      console.error('UserRepository Error - initUserData()')

      return
    }
  }

  async getAccessToken(): Promise<string> {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken')

      return accessToken ?? ''
    } catch (error) {
      console.error('UserRepository Error - getAccessToken()')

      return ''
    }
  }

  async getRefreshToken(): Promise<string> {
    try {
      const refreshToken = await EncryptedStorage.getItem('refreshToken')

      return refreshToken ?? ''
    } catch (error) {
      console.error('UserRepository Error - getAccessToken()')

      return ''
    }
  }

  async getUserName(): Promise<string> {
    try {
      const storedProfile = await EncryptedStorage.getItem('user_profile')

      if (storedProfile !== null && storedProfile !== undefined) {
        const userProfile = JSON.parse(storedProfile)

        return userProfile.name
      } else {
        console.error('UserRepository Warn - getUserName() : UserName is Empty')

        return ''
      }
    } catch (error) {
      console.error('UserRepository Error - getUserName()')

      return ''
    }
  }

  async getUserProfileImageUrl(): Promise<string> {
    try {
      const storedProfile = await EncryptedStorage.getItem('user_profile')

      if (storedProfile !== null && storedProfile !== undefined) {
        const userProfile = JSON.parse(storedProfile)

        return userProfile.profileUrl
      } else {
        console.log(
          'UserRepository Warn - getUserProfileImageUrl() : profileUrl is Empty'
        )

        return ''
      }
    } catch (error) {
      console.error('UserRepository Error - getUserProfileImageUrl()')

      return ''
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const storedProfile = await EncryptedStorage.getItem('user_profile')

      if (storedProfile !== null && storedProfile !== undefined) {
        const userProfile = JSON.parse(storedProfile)

        return userProfile
      } else {
        return null
      }
    } catch (error) {
      console.error('UserRepository Error - getUserProfile()')

      return null
    }
  }

  async updateUserProfile(name: string, profileUrl: string): Promise<void> {
    try {
      const storedProfile = await EncryptedStorage.getItem('user_profile')

      if (storedProfile !== undefined && storedProfile !== null) {
        const userProfile = JSON.parse(storedProfile)
        userProfile.profileImageUrl = profileUrl

        await EncryptedStorage.setItem(
          'user_profile',
          JSON.stringify(userProfile)
        )
      }
    } catch (error) {
      console.error('UserRepository Error - getUserProfile()')

      return
    }
  }

  async deleteUserData(): Promise<void> {
    try {
    } catch (error) {
      console.error('UserRepository Error - getUserProfile()')

      return
    }
  }
}
