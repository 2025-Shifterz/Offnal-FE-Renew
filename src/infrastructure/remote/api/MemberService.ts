import axios from 'axios'
import api from './axiosInstance'
import { GetProfileResponse } from '../response/GetProfileResponse'
import { PatchProfileRequest } from '../request/PatchProfileRequest'
import { ImagePickerAssetRequest } from '../request/ImagePickerAssetRequest'
import { PatchProfileResponse } from '../response/PatchProfileResponse'
import { GetPresignedUrlResponse } from '../response/GetPresignedUrlResponse'

export class MemberService {
  getProfile = async () => {
    try {
      const response = await api.get<GetProfileResponse>('/members/profile')
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  updateProfile = async (profileData: PatchProfileRequest) => {
    try {
      const response = await api.patch<PatchProfileResponse>(
        '/members/profile',
        profileData
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  updateProfileImage = async (image: ImagePickerAssetRequest) => {
    try {
      const mimeType = image.type
      const extension = mimeType.split('/')[1]?.replace('jpeg', 'jpg')

      if (!extension) {
        return
      }

      const presignedResponse = await api.post<GetPresignedUrlResponse>(
        '/members/profile/upload-url',
        { extension }
      )

      console.log('presignedResponse:', mimeType)

      const { uploadUrl } = presignedResponse.data.data

      const fileResponse = await fetch(image.uri)
      const fileBlob = await fileResponse.blob()

      if (!fileBlob) {
        return
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
        },
        body: fileBlob,
      })

      if (!uploadResponse.ok) {
        console.error(
          'S3 업로드 실패:',
          uploadResponse.status,
          await uploadResponse.text()
        )
        throw new Error('S3 업로드에 실패했습니다.')
      }

      console.log('S3 업로드 성공!')
      return
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }
      throw error
    }
  }

  withdrawMember = async () => {
    try {
      await api.delete('/members/withdraw')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 요청 실패:', error.response?.data || error.message)
      } else {
        console.error('알 수 없는 에러:', error)
      }

      throw error
    }
  }
}
