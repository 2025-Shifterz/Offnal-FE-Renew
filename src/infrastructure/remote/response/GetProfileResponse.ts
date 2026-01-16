export interface GetProfileResponse {
  code: string
  message: string
  data: {
    memberName: string
    email: string
    phoneNumber: string
    profileImageUrl: string
  }
}
