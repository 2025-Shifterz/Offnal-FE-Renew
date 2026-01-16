export interface PatchProfileResponse {
  code: string
  message: string
  data: {
    id: number
    email: string
    memberName: string
    phoneNumber: string
    profileImageKey: string
    profileImageUrl: string
  }
}
