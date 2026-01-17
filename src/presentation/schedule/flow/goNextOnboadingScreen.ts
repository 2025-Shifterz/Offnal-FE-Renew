import { OnboardingStepByMethod } from '../../../shared/types/OnboardingStepByMethod'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { NEW_FLOW, OCR_FLOW } from '../constant/flow'
import { OnboardingMethod } from '../../../shared/types/OnboardingMethod'

const FLOW_BY_METHOD: Record<
  OnboardingStepByMethod['method'],
  OnboardingStep[]
> = {
  NEW: NEW_FLOW,
  OCR: OCR_FLOW,
  DIRECT: [], // DIRECT 방식은 플로우가 없음
}

const goNextOnboadingScreen = (
  onboardingMethod: OnboardingMethod,
  currentStep: OnboardingStep
): OnboardingStep | null => {
  const flow = FLOW_BY_METHOD[onboardingMethod]
  if (!flow) return null

  const currentStepIndex = flow.indexOf(currentStep)
  if (currentStepIndex === -1) return null

  const nextStepIndex = currentStepIndex + 1
  return flow[nextStepIndex] ?? null
}

export default goNextOnboadingScreen
