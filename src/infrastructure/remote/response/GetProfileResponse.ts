export interface GetProfileResponse {
  code: string
  message: string
  data: {
    name: string
    email: string
    phoneNumber: string
    profileImageUrl: string
  }
}
