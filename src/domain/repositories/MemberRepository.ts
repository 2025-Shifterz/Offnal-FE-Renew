import { Profile } from '../models/Profile'

export interface MemberRepository {
  updateUserProfile(
    fileUrl: string,
    fileType: string,
    fileName: string,
    userName: string
  ): Promise<Profile>

  withDrawMember(): Promise<void>
}
