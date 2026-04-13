export interface PostLoginWithKakaoResponse {
  code: string
  message: string
  data: PostLoginWithKakaoResponseData
}

export interface PostLoginWithKakaoResponseData {
  memberName: string
  email: string
  profileImageKey: string | null
  newMember: boolean
  accessToken: string
  refreshToken: string
}
