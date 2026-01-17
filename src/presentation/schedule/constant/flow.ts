import { OnboardingStep } from '../../../shared/types/OnboardingStep'

// 근무표 수동 입력 플로우
export const NEW_FLOW: OnboardingStep[] = [
  OnboardingStep.SelectScheduleScope,
  OnboardingStep.InputSchedule,
  OnboardingStep.InputCalendarType,
  OnboardingStep.CompleteSchedule,
]

// 근무표 OCR 인식 플로우
export const OCR_FLOW: OnboardingStep[] = [
  OnboardingStep.SelectScheduleScope,
  OnboardingStep.InputSchedule,
  OnboardingStep.SelectMonthOCR,
  OnboardingStep.SelectPhotoOCR,
  OnboardingStep.EditScheduleOCR,
  OnboardingStep.CompleteSchedule,
]
