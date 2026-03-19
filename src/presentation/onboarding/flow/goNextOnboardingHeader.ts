import { OnboardingMethod, OnboardingStep } from '../types/onboardingTypes'
import { FLOW_BY_METHOD } from '../constant/flow'

export const goNextOnboardingHeader = (
  method: OnboardingMethod,
  currentStep: OnboardingStep
) => {
  const flow = FLOW_BY_METHOD[method]
  if (!flow) return null

  const index = flow.indexOf(currentStep)
  if (index === -1) return null

  return {
    currentStep: index,
    totalSteps: flow.length,
  }
}
