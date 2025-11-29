export interface PostRefreshTokenResponse {
  code: string
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}
