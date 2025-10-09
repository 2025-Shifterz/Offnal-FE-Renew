import { OcrResult, OcrResultItem } from '../../domain/models/OcrResult'

export const toOcrResultDomain = (
  data: [string, { [day: string]: string }][]
): OcrResult => {
  return data.map(
    ([category, schedule]): OcrResultItem => ({
      category,
      schedule,
    })
  )
}
