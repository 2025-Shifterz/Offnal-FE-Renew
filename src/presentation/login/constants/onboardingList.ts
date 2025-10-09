import type { SvgProps } from 'react-native-svg'
import ShoesIcon from '../../../assets/icons/ic_shoes.svg'
import CalendarIcon from '../../../assets/icons/ic_chalendar.svg'
import ClockIcon from '../../../assets/icons/ic_clock-lottie.svg'

export interface OnboardingItem {
  keyword: string
  title: string
  subtitle: string
  image: React.FC<SvgProps>
}

export const onboardingList: OnboardingItem[] = [
  {
    keyword: '근무 인식 & 루틴 자동화',
    title: '교대 근무표를 등록하면\n하루 루틴 자동 생성',
    subtitle: '교대 근무 패턴에 맞춘 수면•식사•운동 추천까지 한 번에',
    image: ShoesIcon,
  },
  {
    keyword: 'AI 근무표 인식',
    title: '사진 찍으면 AI가\n복잡한 근무표 자동 등록',
    subtitle: '교대근무 일정과 메모, 할 일을 한 눈에 보이게',
    image: CalendarIcon,
  },
  {
    keyword: '자동 알람',
    title: '그 날의 근무 형태에 따라\n설정한 알람이 기상을 도와요',
    subtitle: '교대근무 일정을 팀에서 쉽게 공유하고 조율',
    image: ClockIcon,
  },
]
