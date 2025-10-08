import {
  OCRResultEntity,
  OCRResultItemEntity,
} from '../models/OCRResultItemEntity'

export const toOCRResultDataModel = (
  data: [string, { [day: string]: string }][]
): OCRResultEntity => {
  return data.map(
    (item): OCRResultItemEntity => ({
      category: item[0],
      schedule: item[1],
    })
  )
}
