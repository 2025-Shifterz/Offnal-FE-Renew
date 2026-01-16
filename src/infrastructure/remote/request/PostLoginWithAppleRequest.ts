export interface PostLoginWithAppleRequest {
  identityToken: string
  authorizationCode: string
  user: string
  email: string
  fullName: {
    givenName: string
    familyName: string
  }
}
