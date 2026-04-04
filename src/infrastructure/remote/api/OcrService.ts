import axios from 'axios'
import { Asset } from 'react-native-image-picker'
import apiAxiosClient from '../axios/createApiAxiosClient'
import { PostBedrockVisionResponse } from '../response/PostBedrockVisionResponse'

export class OcrService {
  getVisionResult = async (
    asset: Asset
  ): Promise<PostBedrockVisionResponse> => {
    const formData = this.createImageFormData('image', asset)

    const response = await apiAxiosClient.post<PostBedrockVisionResponse>(
      '/bedrock/vision',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    return response.data
  }

  private createImageFormData(fieldName: 'file' | 'image', asset: Asset) {
    if (!asset.uri) {
      throw new Error('업로드할 이미지 URI가 없습니다.')
    }

    const formData = new FormData()

    formData.append(fieldName, {
      uri: asset.uri,
      name: asset.fileName || 'upload.jpg',
      type: asset.type || 'image/jpeg',
    } as unknown as Blob)

    return formData
  }
}
