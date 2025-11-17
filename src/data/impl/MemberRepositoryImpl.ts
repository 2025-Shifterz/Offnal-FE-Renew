import { Profile } from '../../domain/models/Profile'
import { MemberRepository } from '../../domain/repositories/MemberRepository'
import { MemberService } from '../../infrastructure/remote/api/MemberService'
import { ImagePickerAssetRequest } from '../../infrastructure/remote/request/ImagePickerAssetRequest'
import { PatchProfileRequest } from '../../infrastructure/remote/request/PatchProfileRequest'
import { toProfileDomain } from '../mappers/ProfileMapper'

export class MemberRepositoryImpl implements MemberRepository {
  constructor(private memberService: MemberService) {}

  async updateUserProfile(
    fileUrl: string,
    fileType: string,
    fileName: string,
    userName: string
  ): Promise<Profile> {
    const imageReq: ImagePickerAssetRequest = {
      uri: fileUrl,
      type: fileType,
      fileName: fileName,
    }
    const req: PatchProfileRequest = { name: userName }

    try {
      await this.memberService.updateProfileImage(imageReq)
      const result = await this.memberService.updateProfile(req)

      const profile = toProfileDomain(result)

      return profile
    } catch (error) {
      throw error
    }
  }

  async withDrawMember(): Promise<void> {
    await this.memberService.withdrawMember()
  }
}
