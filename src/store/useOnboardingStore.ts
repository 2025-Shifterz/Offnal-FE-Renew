import { create } from 'zustand'
import { OnboardingMethod } from '../shared/types/OnboardingMethod'
import { OnboardingStep } from '../shared/types/OnboardingStep'
import { ScheduleScope } from '../shared/types/ScheduleScope'

interface OnboardingState {
  // 온보딩 방식 - OCR, NEW, DIRECT, EXISTING_OCR(근무표가 이미 있는 경우 OCR)
  onboardingMethod: OnboardingMethod
  currentStep: OnboardingStep

  // 근무표 범위 설정 - 전체 / 개인
  scheduleScope: ScheduleScope

  setOnboardingMethod: (method: OnboardingMethod) => void
  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) => void

  setScheduleScope: (scope: ScheduleScope) => void
}

export const useOnboardingStore = create<OnboardingState>(set => ({
  onboardingMethod: 'OCR',
  currentStep: OnboardingStep.SelectScheduleScope,

  scheduleScope: 'ALL',

  setOnboardingMethod: (method: OnboardingMethod) =>
    set(() => ({ onboardingMethod: method })),

  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) =>
    set(() => ({ onboardingMethod: method, currentStep: step })),

  setScheduleScope: (scope: ScheduleScope) =>
    set(() => ({ scheduleScope: scope })),
}))
