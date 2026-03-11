import { OnboardingMethod } from './OnboardingMethod'
import { OnboardingStep } from './OnboardingStep'

export type OnboardingStepByMethod = {
  method: OnboardingMethod
  currentStep: OnboardingStep
}
