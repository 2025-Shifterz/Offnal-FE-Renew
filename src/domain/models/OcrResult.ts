export interface OcrResultItem {
  team: string
  shifts: Record<string, string>
}

export type OcrResult = OcrResultItem[]
