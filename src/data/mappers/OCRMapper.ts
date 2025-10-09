import {
  OCRResultEntity,
  OCRResultItemEntity,
} from '../models/OCRResultItemEntity'

export const toOCRResultDataModel = (
  data: [string, { [day: string]: string }][]
): OCRResultEntity => {
  return data.map(
    ([category, schedule]): OCRResultItemEntity => ({
      category,
      schedule,
    })
  )
}
