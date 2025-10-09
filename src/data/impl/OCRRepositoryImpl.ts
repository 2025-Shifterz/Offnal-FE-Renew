import { Asset } from 'react-native-image-picker'
import { OCRRepository } from '../../domain/repositories/OCRRepository'
import { OcrService } from '../../infrastructure/remote/api/OcrService'
import { toOCRResultDataModel } from '../mappers/OCRMapper'
import { OCRResultEntity } from '../models/OCRResultItemEntity'

export class OCRRepositoryImpl implements OCRRepository {
  constructor(private ocrService: OcrService) {}

  async getOcrResult(asset: Asset): Promise<OCRResultEntity | undefined> {
    const response = await this.ocrService.getOcrResult(asset)
    if (response === undefined) {
      return undefined
    }

    const result = toOCRResultDataModel(response)
    return result
  }
}
