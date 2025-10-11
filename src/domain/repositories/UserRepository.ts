import { UserProfile } from '../../data/model/UserProfile'

export interface UserRepository {
  initUserData(
    accessToken: string,
    refreshToken: string,
    name: string
  ): Promise<void>

  getAccessToken(): Promise<string>

  getRefreshToken(): Promise<string>

  getUserName(): Promise<string>

  getUserProfileImageUrl(): Promise<string>

  getUserProfile(): Promise<UserProfile | null>

  updateUserProfile(name: string, profileUrl: string): Promise<void>

  deleteUserData(): Promise<void>
}
