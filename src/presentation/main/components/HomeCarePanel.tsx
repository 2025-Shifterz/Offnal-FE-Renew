import React, { FC, useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import dayjs from 'dayjs'
import { SvgProps } from 'react-native-svg'
import BedIcon from '../../../assets/icons/ic_bed_24.svg'
import TablewareIcon from '../../../assets/icons/ic_tableware.svg'
import DishesIcon from '../../../assets/icons/ic_dishes_24.svg'
import MoonIcon from '../../../assets/icons/ic_moon_28.svg'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_50.svg'
import RiceIcon from '../../../assets/icons/ic_rice_28.svg'
import BowlIcon from '../../../assets/icons/ic_bowl_28.svg'
import useHealthData from '../../../shared/hooks/useHealthData'
import { Routine } from '../../../domain/models/Routine'
import { Schedule } from '../../../domain/models/Schedule'
import { useUserStore } from '../../../store/useUserStore'
import { STEP_GOAL } from '../constants/stepGoal'
import HealthMetricCard from './HealthMetricCard'
import GoalStatusCard, { GoalStatusIcon } from './GoalStatusCard'

interface HomeCarePanelProps {
  routine?: Routine
  schedule?: Schedule
}

type RoutineStatus = 'done' | 'current' | 'ready'

interface RoutineItem {
  title: string
  time: string
  description: string
  icon: FC<SvgProps>
  backgroundColor: string
}

interface RoutineCard {
  title: string
  status: RoutineStatus
  items: RoutineItem[]
}

const statusMap: Record<
  RoutineStatus,
  { label: string; dot: string; backgroundColor: string }
> = {
  done: {
    label: '수행 완료',
    dot: '#3FA654',
    backgroundColor: '#EAF6EC',
  },
  current: {
    label: '진행 중',
    dot: '#2098F3',
    backgroundColor: '#E7F4FE',
  },
  ready: {
    label: '예정',
    dot: '#8A949E',
    backgroundColor: '#F4F5F6',
  },
}

const workTypeName: Record<string, string> = {
  DAY: '주간 근무',
  EVENING: '오후 근무',
  NIGHT: '야간 근무',
  OFF: '휴일',
}

const ContentImage = ({ type }: { type: 'badge' | 'meal' }) => {
  const Icon = type === 'badge' ? MoonIcon : RiceIcon
  const colors =
    type === 'badge' ? ['#EEF5FF', '#DCEBFF'] : ['#FFF3DB', '#FDEFE7']

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.contentImage}
    >
      <View className="h-[58px] w-[58px] items-center justify-center rounded-radius-max bg-surface-white">
        <Icon width={36} height={36} />
      </View>
    </LinearGradient>
  )
}

const SectionTitle = ({
  title,
  highlight,
}: {
  title: string
  highlight?: string
}) => (
  <View className="w-full flex-row items-center">
    <View className="h-[20px] w-[6px]" />
    <Text className="flex-1 text-text-basic heading-xxs">
      {title}
      {highlight && <Text className="text-text-primary">{highlight}</Text>}
    </Text>
  </View>
)

const Pill = ({ children }: { children: React.ReactNode }) => (
  <View className="rounded-radius-max border border-surface-gray-subtle2 bg-surface-gray-subtle1 px-[12px] py-[5px]">
    <Text className="text-text-subtle heading-xxxxs">{children}</Text>
  </View>
)

const StatusPill = ({ status }: { status: RoutineStatus }) => {
  const config = statusMap[status]

  return (
    <View
      className="flex-row items-center gap-[6px] rounded-radius-max px-[10px] py-[5px]"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <View
        className="h-[4px] w-[4px] rounded-radius-max"
        style={{ backgroundColor: config.dot }}
      />
      <Text className="text-text-subtle heading-xxxxs">{config.label}</Text>
    </View>
  )
}

const RoutineIcon = ({
  Icon,
  backgroundColor,
}: {
  Icon: FC<SvgProps>
  backgroundColor: string
}) => (
  <View
    className="h-[40px] w-[40px] items-center justify-center rounded-radius-max border border-dashed border-border-gray"
    style={{ backgroundColor }}
  >
    <Icon width={24} height={24} />
  </View>
)

const RoutineConnector = () => (
  <View className="h-[18px] w-[40px] items-center justify-center">
    <View className="h-full border-l border-dashed border-gray-20" />
  </View>
)

const RoutineRow = ({ item }: { item: RoutineItem }) => (
  <View className="h-[44px] w-full flex-row items-center gap-[12px] py-[2px]">
    <RoutineIcon Icon={item.icon} backgroundColor={item.backgroundColor} />
    <View className="min-w-0 flex-1 gap-[2px]">
      <View className="w-full flex-row items-center justify-between gap-[8px]">
        <Text className="text-text-bolder heading-xxxs">{item.title}</Text>
        <Text className="text-right text-text-disabled body-xxs">
          {item.time}
        </Text>
      </View>
      <Text className="text-text-disabled-on body-xxs" numberOfLines={1}>
        {item.description}
      </Text>
    </View>
  </View>
)

const RoutineCardView = ({ card }: { card: RoutineCard }) => (
  <View className="w-[320px] rounded-radius-xl bg-surface-white p-number-6">
    <View className="mb-[16px] flex-row items-center justify-between gap-[8px]">
      <Pill>{card.title}</Pill>
      <View className="min-w-0 flex-1 border-t border-dashed border-gray-20" />
      <StatusPill status={card.status} />
    </View>

    {card.items.map((item, index) => (
      <React.Fragment key={`${card.title}-${item.title}`}>
        <RoutineRow item={item} />
        {index < card.items.length - 1 && <RoutineConnector />}
      </React.Fragment>
    ))}
  </View>
)

const ContentCard = ({
  imageType,
  title,
}: {
  imageType: 'badge' | 'meal'
  title: string
}) => (
  <View className="w-[196px] gap-[8px] rounded-radius-xl bg-surface-white p-[10px]">
    <ContentImage type={imageType} />
    <Text className="text-text-subtle body-xxs" numberOfLines={2}>
      {title}
    </Text>
  </View>
)

const getWeightStatus = (bmi: number) => {
  if (!bmi) return null
  if (bmi < 18.5) return '저체중'
  if (bmi < 23) return '표준'
  if (bmi < 25) return '과체중'
  return '비만'
}

const HomeCarePanel = ({ routine, schedule }: HomeCarePanelProps) => {
  const { healthData } = useHealthData()
  const userName = useUserStore(state => state.user?.memberName)
  const today = useMemo(() => dayjs(), [])
  const weekDays = useMemo(() => {
    const monday = today.subtract((today.day() + 6) % 7, 'day')
    return Array.from({ length: 7 }, (_, index) => monday.add(index, 'day'))
  }, [today])

  const meal = routine?.meals?.[0]
  const secondMeal = routine?.meals?.[1]
  const sleepGuide =
    routine?.health?.sleepGuide?.join(' ') || '5시간 수면 채운 후 기상'
  const sleepTime = routine?.health?.sleepSchedule || '15:00 ~ 20:00'
  const fastingTime = routine?.health?.fastingSchedule || '01:00 이전'
  const workType = schedule?.todayType
    ? workTypeName[schedule.todayType] || '근무'
    : '근무'

  const routineCards: RoutineCard[] = [
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
    <View className="flex-1 gap-[16px] rounded-t-radius-xl bg-background-gray-subtle1 p-number-9">
      <View className="gap-[12px]">
        <SectionTitle
          title={`${userName || '예진'}님을 위한`}
          highlight={` ${workType} 전용 루틴`}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.routineScroll}
        >
          {routineCards.map(card => (
            <RoutineCardView key={card.title} card={card} />
          ))}
        </ScrollView>
      </View>

      <View className="gap-[12px]">
        <SectionTitle title="오늘 나의 건강 관리 카드" />
        <View className="flex-row gap-[8px]">
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
        <GoalStatusCard states={goalStates} />
      </View>

      <View className="gap-[12px]">
        <SectionTitle title="추천 건강 컨텐츠" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentScroll}
        >
          <ContentCard
            imageType="badge"
            title="[간호사 공구] 사원증 목걸이 녹음기 공구 시작"
          />
          <ContentCard
            imageType="meal"
            title="[혈당관리식] 단백질이 풍부한 식사 준비하기"
          />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentImage: {
    alignItems: 'center',
    borderRadius: 16,
    height: 101,
    justifyContent: 'center',
    width: '100%',
  },
  contentScroll: {
    gap: 8,
    paddingRight: 20,
  },
  routineScroll: {
    gap: 8,
    paddingRight: 20,
  },
})

export default HomeCarePanel
