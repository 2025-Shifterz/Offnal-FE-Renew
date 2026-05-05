import React, { useCallback, useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_50.svg'
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
import { buildMainRoutineCards } from '../../../shared/components/routine/routineContent'

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
  const workType = getWorkTypeLabel(schedule?.todayType)

  const routineCards: RoutineCardProps[] = useMemo(
    () => buildMainRoutineCards(routine),
    [routine]
  )

  const handleRoutinePress = useCallback(() => {
    navigation.navigate('DailyRoutine', { day: 'today' })
  }, [navigation])

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
              key={card.id}
              title={card.title}
              status={card.status}
              items={card.items}
              onPress={handleRoutinePress}
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
