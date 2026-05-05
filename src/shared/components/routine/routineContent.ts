import { Routine } from '../../../domain/models/Routine'
import { RoutineIllustrationName } from './RoutineIllustration'
import {
  getRoutineIllustration,
  RoutineIllustrationCategory,
} from './routineIllustrationMap'

export type RoutineDay = 'today' | 'tomorrow'

export type RoutineStatus = 'done' | 'current' | 'ready'

export type DailyRoutineState = 'done' | 'todo'

export type DailyRoutineTimePosition = 'past' | 'current' | 'future'

export interface RoutineTimeWindow {
  startTime: string
  endTime: string
}

export interface RoutineCardContentItem {
  id: string
  title: string
  time: string
  description: string
  illustration: RoutineIllustrationName
  backgroundColor?: string
}

export interface RoutineCardContent {
  id: string
  title: string
  status: RoutineStatus
  items: RoutineCardContentItem[]
}

export interface DailyRoutineDescriptionContent {
  prefix?: string
  emphasis?: string
  suffix?: string
}

export interface DailyRoutineCardContentItem {
  id: string
  title: string
  time: string
  descriptions: DailyRoutineDescriptionContent[]
  illustration: RoutineIllustrationName
  backgroundColor?: string
  state: DailyRoutineState
  highlighted?: boolean
  faded?: boolean
  compact?: boolean
  timeWindow: RoutineTimeWindow
  timePosition: DailyRoutineTimePosition
}

export interface DailyRoutineSectionContent {
  id: string
  title: string
  highlight: string
  status: RoutineStatus
  items: DailyRoutineCardContentItem[]
}

export type RoutineCompletionMap = Record<string, boolean>

type RoutineMinuteWindow = {
  startMinutes: number
  endMinutes: number
}

const parseTimeMinutes = (time: string) => {
  const [hourText, minuteText] = time.trim().split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null
  }

  return hour * 60 + minute
}

const normalizeTimelineMinutes = (
  minutes: number,
  anchorStartMinutes: number
) => (minutes < anchorStartMinutes ? minutes + 24 * 60 : minutes)

const getRoutineWindowMinutes = (
  timeWindow: RoutineTimeWindow,
  anchorStartMinutes: number
): RoutineMinuteWindow | null => {
  const startMinutes = parseTimeMinutes(timeWindow.startTime)
  const endMinutes = parseTimeMinutes(timeWindow.endTime)

  if (startMinutes === null || endMinutes === null) {
    return null
  }

  const normalizedStartMinutes = normalizeTimelineMinutes(
    startMinutes,
    anchorStartMinutes
  )
  const normalizedEndMinutes = normalizeTimelineMinutes(
    endMinutes,
    anchorStartMinutes
  )

  return {
    startMinutes: normalizedStartMinutes,
    endMinutes:
      normalizedEndMinutes <= normalizedStartMinutes
        ? normalizedEndMinutes + 24 * 60
        : normalizedEndMinutes,
  }
}

const getRoutineTimePosition = (
  timeWindow: RoutineTimeWindow,
  nowMillis: number,
  anchorStartMinutes: number
): DailyRoutineTimePosition => {
  const windowMinutes = getRoutineWindowMinutes(timeWindow, anchorStartMinutes)

  if (windowMinutes === null) {
    return 'future'
  }

  const currentDate = new Date(nowMillis)
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
  const currentTimelineMinutes = normalizeTimelineMinutes(
    currentMinutes,
    anchorStartMinutes
  )

  if (currentTimelineMinutes < windowMinutes.startMinutes) {
    return 'future'
  }

  if (currentTimelineMinutes < windowMinutes.endMinutes) {
    return 'current'
  }

  return 'past'
}

export const parseRoutineTimeWindow = (
  timeLabel: string
): RoutineTimeWindow | null => {
  const [startTime, endTime] = timeLabel.split('~').map(part => part.trim())

  if (!startTime || !endTime) {
    return null
  }

  if (parseTimeMinutes(startTime) === null) {
    return null
  }

  if (parseTimeMinutes(endTime) === null) {
    return null
  }

  return { startTime, endTime }
}

export const isRoutineTimeWindowActive = (
  timeWindow: RoutineTimeWindow,
  nowMillis: number = Date.now()
) => {
  const startMinutes = parseTimeMinutes(timeWindow.startTime)
  const endMinutes = parseTimeMinutes(timeWindow.endTime)

  if (startMinutes === null || endMinutes === null) {
    return false
  }

  const currentDate = new Date(nowMillis)
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
  const crossesMidnight = endMinutes <= startMinutes

  if (!crossesMidnight) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes
}

export const getRoutineDayTitle = (routineDay: RoutineDay) =>
  routineDay === 'tomorrow' ? '내일 나의' : '오늘 나의'

const getDailyRoutineTimelineStartMinutes = () => {
  const firstSection = DAILY_ROUTINE_SECTION_TEMPLATES[0]
  const firstItem = firstSection?.items[0]
  const firstTimeWindow = firstItem
    ? parseRoutineTimeWindow(firstItem.time)
    : null
  const firstStartMinutes = firstTimeWindow
    ? parseTimeMinutes(firstTimeWindow.startTime)
    : null

  return firstStartMinutes ?? 0
}

type MainRoutineCardTemplate = {
  id: string
  title: string
  status: RoutineStatus
  items: Array<
    Omit<RoutineCardContentItem, 'illustration'> & {
      category: RoutineIllustrationCategory
    }
  >
}

const resolveRoutineItems = (
  items: MainRoutineCardTemplate['items']
): RoutineCardContentItem[] =>
  items.map(({ category, ...item }) => ({
    ...item,
    illustration: getRoutineIllustration(category),
  }))

export const buildMainRoutineCards = (
  routine?: Routine
): RoutineCardContent[] => {
  const meal = routine?.meals?.[0]
  const secondMeal = routine?.meals?.[1]
  const sleepGuide =
    routine?.health?.sleepGuide?.join(' ') || '5시간 수면 채운 후 기상'
  const sleepTime = routine?.health?.sleepSchedule || '15:00 ~ 20:00'
  const fastingTime = routine?.health?.fastingSchedule || '01:00 이전'

  const cards: MainRoutineCardTemplate[] = [
    {
      id: 'main-before-work',
      title: '근무 전 루틴',
      status: 'done',
      items: [
        {
          id: 'main-before-work-sleep',
          category: 'sleep',
          title: '낮잠',
          time: sleepTime,
          description: sleepGuide,
          backgroundColor: '#F6F3FF',
        },
        {
          id: 'main-before-work-meal',
          category: 'meal',
          title: meal?.label || '식사',
          time: meal?.time || '20:00 ~ 21:00',
          description: meal
            ? `추천 메뉴: ${meal.items.join(', ')}`
            : '추천 메뉴: 현미밥, 생선구이, 채소',
          backgroundColor: '#FFFAF2',
        },
        {
          id: 'main-before-work-ready',
          category: 'readyForWork',
          title: '출근 준비',
          time: '21:00 ~ 22:30',
          description: '샤워와 스트레칭하기',
          backgroundColor: '#FFFFF3',
        },
      ],
    },
    {
      id: 'main-during-work',
      title: '근무 중 루틴',
      status: 'current',
      items: [
        {
          id: 'main-during-work-focus',
          category: 'working',
          title: '근무 집중 구간',
          time: '21:00 ~ 22:30',
          description: `카페인은 ${fastingTime}까지만`,
          backgroundColor: '#F4F5F6',
        },
        {
          id: 'main-during-work-snack',
          category: 'snack',
          title: secondMeal?.label || '간식',
          time: secondMeal?.time || '01:00 ~ 02:00',
          description: secondMeal
            ? `추천메뉴: ${secondMeal.items.join(', ')}`
            : '추천메뉴: 연두부, 물',
          backgroundColor: '#EEFFF2',
        },
        {
          id: 'main-during-work-hydration',
          category: 'hydration',
          title: '수분 보충',
          time: '03:00 ~ 04:00',
          description: '물 한 잔과 가벼운 움직임',
          backgroundColor: '#F0FFFC',
        },
      ],
    },
  ]

  return cards.map(card => ({
    ...card,
    items: resolveRoutineItems(card.items),
  }))
}

type DailyRoutineItemTemplate = {
  id: string
  category: RoutineIllustrationCategory
  title: string
  time: string
  descriptions: DailyRoutineDescriptionContent[]
  highlighted?: boolean
  faded?: boolean
  compact?: boolean
  backgroundColor?: string
}

type DailyRoutineSectionTemplate = {
  id: string
  highlight: string
  status: RoutineStatus
  items: DailyRoutineItemTemplate[]
}

const DAILY_ROUTINE_SECTION_TEMPLATES: DailyRoutineSectionTemplate[] = [
  {
    id: 'daily-before-work',
    highlight: ' 출근 전 루틴',
    status: 'done',
    items: [
      {
        id: 'daily-before-work-sleep',
        category: 'sleep',
        title: '낮잠',
        time: '15:00 ~ 20:00',
        descriptions: [
          { prefix: '5~6시간 수면 확보' },
          { prefix: '암막커튼, 귀마개로 수면환경 조성' },
        ],
        compact: true,
        backgroundColor: '#F6F3FF',
      },
      {
        id: 'daily-before-work-meal',
        category: 'meal',
        title: '식사',
        time: '20:00 ~ 21:00',
        descriptions: [
          {
            prefix: '추천 메뉴: ',
            emphasis: '현미밥, 생선구이, 채소',
          },
          { prefix: '근무 전 균형식으로 에너지 충전' },
        ],
        compact: true,
        backgroundColor: '#FFFAF2',
      },
      {
        id: 'daily-before-work-ready',
        category: 'readyForWork',
        title: '출근 준비',
        time: '21:00 ~ 22:30',
        descriptions: [
          { prefix: '샤워와 스트레칭으로 각성' },
          { prefix: '밝은 조명 아래 가볍게 몸 깨우기' },
        ],
        compact: true,
        backgroundColor: '#FFFFF3',
      },
    ],
  },
  {
    id: 'daily-during-work',
    highlight: ' 근무 중 루틴',
    status: 'current',
    items: [
      {
        id: 'daily-during-work-focus',
        category: 'working',
        title: '근무 집중 구간',
        time: '23:00 ~ 01:00',
        descriptions: [
          { prefix: '카페인은 01시 이전까지만 허용' },
          { prefix: '중간 스트레칭으로 졸음 예방' },
        ],
        backgroundColor: '#F4F5F6',
      },
      {
        id: 'daily-during-work-snack',
        category: 'snack',
        title: '간식',
        time: '01:00 ~ 02:00',
        descriptions: [
          {
            prefix: '추천 메뉴: ',
            emphasis: '삶은 달걀, 두유, 통곡물빵',
          },
          { prefix: '고지방·고당류 음식은 피하기' },
        ],
        highlighted: true,
        backgroundColor: '#EEFFF2',
      },
      {
        id: 'daily-during-work-hydration',
        category: 'hydration',
        title: '공복 유지 + 수분 보충',
        time: '02:00 ~ 06:00',
        descriptions: [
          { prefix: '위 부담 줄이기' },
          { prefix: '물·보리차 중심 수분 보충' },
        ],
        backgroundColor: '#F0FFFC',
      },
    ],
  },
  {
    id: 'daily-after-work',
    highlight: ' 퇴근 후 루틴',
    status: 'ready',
    items: [
      {
        id: 'daily-after-work-meal',
        category: 'meal',
        title: '귀가 후 식사',
        time: '07:00 ~ 07:30',
        descriptions: [
          { prefix: '추천 메뉴:', emphasis: ' 죽, 오트밀' },
          { prefix: '과식 피하고 따뜻하게 섭취' },
        ],
        backgroundColor: '#FFFAF2',
      },
      {
        id: 'daily-after-work-sleep',
        category: 'sleep',
        title: '회복 수면',
        time: '08:00 ~ 13:00',
        descriptions: [
          { prefix: '5시간 숙면, 조명 낮추고 공복 1시간 유지' },
          { prefix: '온도 18~20℃로 쾌적하게' },
        ],
        backgroundColor: '#F6F3FF',
      },
      {
        id: 'daily-after-work-rest',
        category: 'rest',
        title: '리듬 회복',
        time: '13:00 ~ 14:00',
        descriptions: [
          { prefix: '햇빛 노출 + 가벼운 산책' },
          { prefix: '휴일엔 생체리듬 되돌리기 좋은 시간대' },
        ],
        backgroundColor: '#E8FBFF',
      },
    ],
  },
]

const resolveDailyRoutineItems = (
  items: DailyRoutineItemTemplate[],
  completedById: RoutineCompletionMap,
  nowMillis: number,
  anchorStartMinutes: number,
  routineDay: RoutineDay
) => {
  return items.map(({ category, ...item }) => {
    const timeWindow = parseRoutineTimeWindow(item.time)
    const timePosition =
      routineDay === 'today' && timeWindow !== null
        ? getRoutineTimePosition(timeWindow, nowMillis, anchorStartMinutes)
        : 'future'
    const isPast = timePosition === 'past'
    const isCurrentWindow = timePosition === 'current'
    const state: DailyRoutineState =
      completedById[item.id] || isPast ? 'done' : 'todo'

    return {
      ...item,
      illustration: getRoutineIllustration(category),
      state,
      highlighted: isCurrentWindow,
      faded: isPast,
      timeWindow: timeWindow ?? {
        startTime: item.time.split('~')[0]?.trim() || '',
        endTime: item.time.split('~')[1]?.trim() || '',
      },
      timePosition,
    }
  })
}

export const buildDailyRoutineSections = ({
  routineDay,
  completedById = {},
  nowMillis = Date.now(),
}: {
  routineDay: RoutineDay
  completedById?: RoutineCompletionMap
  nowMillis?: number
}): DailyRoutineSectionContent[] => {
  const title = getRoutineDayTitle(routineDay)
  const anchorStartMinutes = getDailyRoutineTimelineStartMinutes()

  return DAILY_ROUTINE_SECTION_TEMPLATES.map(section => ({
    id: section.id,
    title,
    highlight: section.highlight,
    status: section.status,
    items: resolveDailyRoutineItems(
      section.items,
      completedById,
      nowMillis,
      anchorStartMinutes,
      routineDay
    ),
  }))
}
