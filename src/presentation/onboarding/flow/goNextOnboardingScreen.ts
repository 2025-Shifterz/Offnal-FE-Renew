import { OnboardingMethod, OnboardingStep } from '../types/onboardingTypes'
import { FLOW_BY_METHOD } from '../constant/flow'

// 현재 step 기준으로 다음 온보딩 스텝을 반환하는 함수

const goNextOnboadingScreen = (
  onboardingMethod: OnboardingMethod,
  currentStep: OnboardingStep
): OnboardingStep => {
  const flow = FLOW_BY_METHOD[onboardingMethod]
  if (!flow) throw new Error(`Invalid onboarding method: ${onboardingMethod}`)

  const currentStepIndex = flow.indexOf(currentStep)
  if (currentStepIndex === -1)
    throw new Error(`Invalid current step: ${currentStep}`)

  return flow[currentStepIndex + 1]
}

export default goNextOnboadingScreen
