import { OnboardingMethod } from '../../../shared/types/OnboardingMethod'
import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { FLOW_BY_METHOD } from '../constant/flow'

export const goNextOnboadingHeader = (
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
