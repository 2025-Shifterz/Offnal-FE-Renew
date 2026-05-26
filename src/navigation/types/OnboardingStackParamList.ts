import { OcrResult } from '../../domain/models/OcrResult'

export type OnboardingStackParamList = {
  SelectScheduleScope: undefined
  InputSchedule: undefined
  SelectMonthOCR: undefined
  SelectPhotoOCR: {
    year: number
    month: number
    ocrResult?: OcrResult
  }
  EditScheduleOCR: {
    year: number
    month: number
    ocrResult?: OcrResult
  }
  InputCalendarType: undefined
  CompleteSchedule: undefined
}
