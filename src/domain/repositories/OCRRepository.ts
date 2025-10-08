import { Asset } from 'react-native-image-picker'
import { OCRResultEntity } from '../../data/models/OCRResultItemEntity'

export interface OCRRepository {
  getOcrResult(asset: Asset): Promise<OCRResultEntity | undefined>
}
