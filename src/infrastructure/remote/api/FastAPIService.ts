import axios from 'axios'
import { Asset } from 'react-native-image-picker'

export class FastAPIService {
  getOcrResult = async (asset: Asset) => {
    const formData = new FormData()

    formData.append('file', {
      uri: asset.uri,
      name: asset.fileName || 'upload.jpg',
      type: asset.type || 'image/jpeg',
    } as any)

    const response = await axios.post(
      'https://api.offnal.site/api/analyze-table',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    console.log('OCR Result: ', response.data)

    if (
      response.data &&
      typeof response.data === 'object' &&
      'result' in response.data
    ) {
      const rawOcrResult = response.data.result

      // Ensure rawOcrResult is an object before converting to entries
      if (typeof rawOcrResult === 'object' && rawOcrResult !== null) {
        const ocrResult: [string, { [day: string]: string }][] =
          Object.entries(rawOcrResult)
        console.log('Serialized OCR Result for Navigation:', ocrResult)

        return ocrResult
      } else {
        console.warn("API response 'result' is not an object:", rawOcrResult)
      }
    } else {
      console.warn(
        "API response does not contain a 'result' key or is not an object:",
        response.data
      )
    }
  }
}
