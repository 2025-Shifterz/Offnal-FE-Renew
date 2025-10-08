import { Asset } from 'react-native-image-picker'
import { OCRRepository } from '../../domain/repositories/OCRRepository'
import { FastAPIService } from '../../infrastructure/remote/api/FastAPIService'
import { toOCRResultDataModel } from '../mappers/OCRMapper'
import { OCRResultEntity } from '../models/OCRResultItemEntity'

export class OCRRepositoryImpl implements OCRRepository {
  constructor(private ocrService: FastAPIService) {}

  async getOcrResult(asset: Asset): Promise<OCRResultEntity | undefined> {
    try {
      const response = await this.ocrService.getOcrResult(asset)
      if (response === undefined) {
        return undefined
      }

      const result = toOCRResultDataModel(response)
      return result
    } catch (error) {
      throw error
    }
  }
}
