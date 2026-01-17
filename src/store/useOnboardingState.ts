import { create } from 'zustand'
import { OnboardingMethod } from '../shared/types/OnboardingMethod'
import { OnboardingStep } from '../shared/types/OnboardingStep'

interface OnboardingState {
  onboardingMethod: OnboardingMethod
  currentStep: OnboardingStep

  setOnboardingMethod: (method: OnboardingMethod) => void

  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) => void
}

export const useOnboardingStore = create<OnboardingState>(set => ({
  onboardingMethod: 'OCR',
  currentStep: OnboardingStep.SelectScheduleScope,

  setOnboardingMethod: (method: OnboardingMethod) =>
    set(() => ({
      onboardingMethod: method,
    })),

  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) =>
    set(() => ({
      onboardingMethod: method,
      currentStep: step,
    })),
}))
