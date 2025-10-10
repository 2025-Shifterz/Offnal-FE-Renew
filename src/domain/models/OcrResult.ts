export interface OcrResultItem {
  category: string
  schedule: { [day: string]: string }
}

export type OcrResult = OcrResultItem[]
