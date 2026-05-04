import React from 'react'
import { ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import BedIcon from '../../../assets/icons/ic_bed_24.svg'
import TablewareIcon from '../../../assets/icons/ic_tableware.svg'
import DishesIcon from '../../../assets/icons/ic_dishes_24.svg'
import MoonIcon from '../../../assets/icons/ic_moon_28.svg'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_50.svg'
import RiceIcon from '../../../assets/icons/ic_rice_28.svg'
import BowlIcon from '../../../assets/icons/ic_bowl_28.svg'
import { getWorkTypeLabel } from '../../../shared/constants/workType'
import useHealthData from '../../../shared/hooks/useHealthData'
import { Routine } from '../../../domain/models/Routine'
import { Schedule } from '../../../domain/models/Schedule'
import { useUserStore } from '../../../store/useUserStore'
import { STEP_GOAL } from '../../../shared/constants/stepGoal'
import HealthMetricCard from './HealthMetricCard'
import GoalStatusCard from './GoalStatusCard'
import RoutineCardView, { RoutineCardProps } from './RoutineCard'
import SectionTitle from './SectionTitle'
import RecommendHealthContentCard from './RecommendHealthContent'
import { rootNavigation } from '../../../navigation/types/StackTypes'

interface HomeCarePanelProps {
  routine?: Routine
  schedule?: Schedule
}

const getWeightStatus = (bmi: number) => {
  if (!bmi) return null
  if (bmi < 18.5) return '저체중'
  if (bmi < 23) return '표준'
  if (bmi < 25) return '과체중'
  return '비만'
}

const HomeCarePanel = ({ routine, schedule }: HomeCarePanelProps) => {
  const navigation = useNavigation<rootNavigation>()
  const { healthData } = useHealthData()
  const userName = useUserStore(state => state.user?.memberName)

  const meal = routine?.meals?.[0]
  const secondMeal = routine?.meals?.[1]
  const sleepGuide =
    routine?.health?.sleepGuide?.join(' ') || '5시간 수면 채운 후 기상'
  const sleepTime = routine?.health?.sleepSchedule || '15:00 ~ 20:00'
  const fastingTime = routine?.health?.fastingSchedule || '01:00 이전'
  const workType = getWorkTypeLabel(schedule?.todayType)

  const routineCards: RoutineCardProps[] = [
    {
      title: '근무 전 루틴',
      status: 'done',
      items: [
        {
          title: '낮잠',
          time: sleepTime,
          description: sleepGuide,
          icon: BedIcon,
          backgroundColor: '#F6F3FF',
        },
        {
          title: meal?.label || '식사',
          time: meal?.time || '20:00 ~ 21:00',
          description: meal
            ? `추천 메뉴: ${meal.items.join(', ')}`
            : '추천 메뉴: 현미밥, 생선구이, 채소',
          icon: TablewareIcon,
          backgroundColor: '#FFFAF2',
        },
        {
          title: '출근 준비',
          time: '21:00 ~ 22:30',
          description: '샤워와 스트레칭하기',
          icon: MoonIcon,
          backgroundColor: '#FFFFF3',
        },
      ],
    },
    {
      title: '근무 중 루틴',
      status: 'current',
      items: [
        {
          title: '근무 집중 구간',
          time: '21:00 ~ 22:30',
          description: `카페인은 ${fastingTime}까지만`,
          icon: DishesIcon,
          backgroundColor: '#F4F5F6',
        },
        {
          title: secondMeal?.label || '간식',
          time: secondMeal?.time || '01:00 ~ 02:00',
          description: secondMeal
            ? `추천메뉴: ${secondMeal.items.join(', ')}`
            : '추천메뉴: 연두부, 물',
          icon: BowlIcon,
          backgroundColor: '#EEFFF2',
        },
        {
          title: '수분 보충',
          time: '03:00 ~ 04:00',
          description: '물 한 잔과 가벼운 움직임',
          icon: RiceIcon,
          backgroundColor: '#F0FFFC',
        },
      ],
    },
  ]

  const stepPercentage = healthData.stepPercentage || 0
  const goalStates: Array<'missed' | 'streak' | 'done'> = [
    'missed',
    'streak',
    'streak',
    'streak',
    'missed',
    'done',
    'missed',
  ]

  return (
    <View className="flex-1 gap-[16px] rounded-t-radius-xl bg-background-gray-subtle1 py-number-9">
      <View className="gap-[12px]">
        <SectionTitle
          title={`${userName || '예진'}님을 위한`}
          highlight={` ${workType} 전용 루틴`}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-[8px] px-number-9"
        >
          {routineCards.map(card => (
            <RoutineCardView
              key={card.title}
              title={card.title}
              status={card.status}
              items={card.items}
              onPress={() =>
                navigation.navigate('DailyRoutine', { day: 'today' })
              }
            />
          ))}
        </ScrollView>
      </View>

      <View className="gap-[12px]">
        <SectionTitle title="오늘 나의 건강 관리 카드" />
        <View className="flex-row gap-[8px] px-number-9">
          <HealthMetricCard
            title="걸음 수"
            value={healthData.steps.toLocaleString()}
            label={`${stepPercentage}%`}
            caption={`/ ${STEP_GOAL.toLocaleString()} 걸음`}
            Icon={SneakersIcon}
          />
          <HealthMetricCard
            title="몸무게 기록"
            value={`${healthData.weight}kg`}
            label={getWeightStatus(healthData.bmi)}
            Icon={WeightIcon}
          />
        </View>
      </View>

      <View className="gap-[12px]">
        <SectionTitle title="금주 나의 목표 달성 확인" />
        <View className="px-number-9">
          <GoalStatusCard states={goalStates} />
        </View>
      </View>

      <View className="gap-[12px]">
        <SectionTitle title="추천 건강 컨텐츠" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-[8px] px-number-9"
        >
          <RecommendHealthContentCard title="[간호사 공구] 사원증 목걸이 녹음기 공구 시작" />
          <RecommendHealthContentCard title="[혈당관리식] 단백질이 풍부한 식사 준비하기" />
        </ScrollView>
      </View>
    </View>
  )
}

export default HomeCarePanel
