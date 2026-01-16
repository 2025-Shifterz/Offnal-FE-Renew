import { Asset } from 'react-native-image-picker'
import { OcrResult } from '../models/OcrResult'

export interface OCRRepository {
  getOcrResult(asset: Asset): Promise<OcrResult | undefined>
}
