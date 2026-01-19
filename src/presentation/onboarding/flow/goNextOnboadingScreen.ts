import { OnboardingStep } from '../../../shared/types/OnboardingStep'
import { OnboardingMethod } from '../../../shared/types/OnboardingMethod'
import { FLOW_BY_METHOD } from '../constant/flow'

// 현재 step 기준으로 다음 온보딩 스텝을 반환하는 함수

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
