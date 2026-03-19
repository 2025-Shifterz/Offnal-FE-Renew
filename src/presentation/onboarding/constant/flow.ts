import {
  OnboardingStep,
  OnboardingStepByMethod,
} from '../types/onboardingTypes'

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

// (근무표가 이미 있는 경우) 근무표 OCR 인식 플로우
// 근무표 기본 정보 입력 단계를 건너뜀
export const EXISTING_OCR_FLOW: OnboardingStep[] = [
  OnboardingStep.SelectScheduleScope,
  OnboardingStep.SelectMonthOCR,
  OnboardingStep.SelectPhotoOCR,
  OnboardingStep.EditScheduleOCR,
  OnboardingStep.CompleteSchedule,
]

export const FLOW_BY_METHOD: Record<
  OnboardingStepByMethod['method'],
  OnboardingStep[]
> = {
  NEW: NEW_FLOW,
  OCR: OCR_FLOW,
  DIRECT: [], // DIRECT 방식은 플로우가 없음
  EXISTING_OCR: EXISTING_OCR_FLOW,
}
