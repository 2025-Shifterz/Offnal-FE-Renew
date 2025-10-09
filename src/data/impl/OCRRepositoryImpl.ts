import { Asset } from 'react-native-image-picker'
import { OcrResult } from '../../domain/models/OcrResult'
import { OCRRepository } from '../../domain/repositories/OCRRepository'
import { OcrService } from '../../infrastructure/remote/api/OcrService'
import { toOcrResultDomain } from '../mappers/OCRMapper'

export class OCRRepositoryImpl implements OCRRepository {
  constructor(private ocrService: OcrService) {}

  async getOcrResult(asset: Asset): Promise<OcrResult | undefined> {
    const response = await this.ocrService.getOcrResult(asset)
    if (response === undefined) {
      return undefined
    }

    const result = toOcrResultDomain(response)
    return result
  }
}
