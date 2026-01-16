export interface OCRResultItemEntity {
  category: string
  schedule: { [day: string]: string }
}

export type OCRResultEntity = OCRResultItemEntity[]
