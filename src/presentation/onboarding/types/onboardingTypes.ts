/**
 * ## OnboardingMethod
 *
 * 근무표 등록 방식
 *
 * @enum
 * @property {string} OCR - OCR 방식
 * @property {string} NEW - 수동 입력 방식
 * @property {string} DIRECT - 직접 입력 방식
 * @property {string} EXISTING_OCR - 기존 근무표 OCR 방식
 */
export type OnboardingMethod = 'OCR' | 'NEW' | 'DIRECT' | 'EXISTING_OCR'

/**
 * ### OnboardingStep
 *
 * 근무표 등록 단계
 *
 * @enum
 * @property {string} SelectScheduleScope - 근무표 범위 선택
 * @property {string} InputSchedule - 근무표 기본 정보 입력
 * @property {string} SelectMonthOCR - OCR 달력 선택
 * @property {string} SelectPhotoOCR - OCR 사진 선택
 * @property {string} EditScheduleOCR - OCR 근무표 편집
 * @property {string} InputCalendarType - 달력에 근무 형태 입력
 * @property {string} CompleteSchedule - 근무표 등록 완료
 */
export enum OnboardingStep {
  SelectScheduleScope = 'SelectScheduleScope',
  InputSchedule = 'InputSchedule',
  SelectMonthOCR = 'SelectMonthOCR',
  SelectPhotoOCR = 'SelectPhotoOCR',
  EditScheduleOCR = 'EditScheduleOCR',
  InputCalendarType = 'InputCalendarType',
  CompleteSchedule = 'CompleteSchedule',
}

/**
 * ### OnboardingStepByMethod
 *
 * 근무표 등록 방식에 따른 단계
 *
 * @property {OnboardingMethod} method - 근무표 등록 방식
 * @property {OnboardingStep} currentStep - 현재 단계
 */
export type OnboardingStepByMethod = {
  method: OnboardingMethod
  currentStep: OnboardingStep
}
