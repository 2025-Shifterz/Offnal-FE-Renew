import { Profile } from '../models/Profile'

export interface MemberRepository {
  updateUserProfile(
    userName: string,
    file?: {
      url: string
      type: string
      name: string
    }
  ): Promise<Profile>

  withDrawMember(): Promise<void>
}
