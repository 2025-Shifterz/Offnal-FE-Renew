import type { SvgProps } from 'react-native-svg'
import IconOnboarding1 from '../../../assets/icons/ic_onboarding_1.svg'
import IconOnboarding2 from '../../../assets/icons/ic_onboarding_2.svg'
import IconOnboarding3 from '../../../assets/icons/ic_onboarding_3.svg'

export interface OnboardingItem {
  title: string
  subtitle: string
  image: React.FC<SvgProps>
  highlight: string
}

export const onboardingList: OnboardingItem[] = [
  {
    title: '교대 근무표를 등록하면\n하루 루틴 자동 생성',
    subtitle: '교대 근무 패턴에 맞춘\n수면•식사 생활패턴까지 한 번에 제공해요',
    image: IconOnboarding1,
    highlight: '하루 루틴',
  },
  {
    title: '사진 찍으면 AI가\n복잡한 근무표 자동 등록',
    subtitle: '빠르고 간단하게\n루틴 설정을 시작할 수 있어요',
    image: IconOnboarding2,
    highlight: '복잡한 근무표 자동 등록',
  },
  {
    title: '그 날의 근무 형태에 따라\n자동 알람 설정',
    subtitle: '매일 알람 변경할 필요 없이\n근무표에 따라 기상 알람이 울려요',
    image: IconOnboarding3,
    highlight: '자동 알람',
  },
]
