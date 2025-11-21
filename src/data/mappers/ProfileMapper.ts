import { Profile } from '../../domain/models/Profile'
import { PatchProfileResponse } from '../../infrastructure/remote/response/PatchProfileResponse'

export const toProfileDomain = (data: PatchProfileResponse): Profile => ({
  name: data.data.memberName,
  email: data.data.email,
  phoneNumber: data.data.phoneNumber,
  profileImageUrl: data.data.profileImageUrl,
})
