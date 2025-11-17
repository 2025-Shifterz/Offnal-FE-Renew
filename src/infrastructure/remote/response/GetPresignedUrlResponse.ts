interface GetPresignedUrlResponse {
  code: string
  message: string
  data: {
    uploadUrl: string
    key: string
  }
}
