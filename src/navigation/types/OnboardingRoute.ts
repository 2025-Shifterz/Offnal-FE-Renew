export type OnboardingRoute =
  | { name: 'SelectScheduleScope' }
  | { name: 'InputSchedule' }
  | { name: 'SelectMonthOCR'; params: { year: number; month: number } }
  | {
      name: 'SelectPhotoOCR'
      params: {
        year: number
        month: number
        ocrResult?: unknown
      }
    }
  | { name: 'EditScheduleOCR' }
  | {
      name: 'InputCalendarType'
    }
  | { name: 'CompleteSchedule' }
