import { Profile } from '../../domain/models/Profile'
import { MemberRepository } from '../../domain/repositories/MemberRepository'
import { MemberService } from '../../infrastructure/remote/api/MemberService'
import { ImagePickerAssetRequest } from '../../infrastructure/remote/request/ImagePickerAssetRequest'
import { PatchProfileRequest } from '../../infrastructure/remote/request/PatchProfileRequest'
import { toProfileDomain } from '../mappers/ProfileMapper'

export class MemberRepositoryImpl implements MemberRepository {
  constructor(private memberService: MemberService) {}

  async updateUserProfile(
    userName: string,
    file?: {
      url: string
      type: string
      name: string
    }
  ): Promise<Profile> {
    const imageReq: ImagePickerAssetRequest = {
      uri: file?.url ?? '',
      type: file?.type ?? '',
      fileName: file?.name ?? '',
    }
    const req: PatchProfileRequest = { name: userName }

    await this.memberService.updateProfileImage(imageReq)
    const result = await this.memberService.updateProfile(req)

    const profile = toProfileDomain(result)

    return profile
  }

  async withDrawMember(): Promise<void> {
    await this.memberService.withdrawMember()
  }
}
