export interface PostLoginWithAppleResponse {
  code: string
  message: string
  data: PostLoginWithAppleResponseData
}

export interface PostLoginWithAppleResponseData {
  phoneNumber: string
  memberName: string
  email: string
  profileImageKey: string
  newMember: boolean
  accessToken: string
  refreshToken: string
}
