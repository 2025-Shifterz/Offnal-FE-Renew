export interface PostLoginWithAppleResponse {
  code: string
  message: string
  data: PostLoginWithAppleResponseData
}

export interface PostLoginWithAppleResponseData {
  data: any
  memberName: string
  email: string
  phoneNumber: string
  profileImageKey: string
  isNewMember: boolean
  accessToken: string
  refreshToken: string
}
