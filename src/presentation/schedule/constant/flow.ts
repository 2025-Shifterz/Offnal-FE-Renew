import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { OnboardingStepByMethod } from '../../../shared/types/OnboardingStepByMethod'

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

export const FLOW_BY_METHOD: Record<
  OnboardingStepByMethod['method'],
  OnboardingStep[]
> = {
  NEW: NEW_FLOW,
  OCR: OCR_FLOW,
  DIRECT: [], // DIRECT 방식은 플로우가 없음
}
