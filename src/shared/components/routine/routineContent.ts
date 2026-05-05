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

type RoutineTextResolver<T> = T | ((routine?: Routine) => T)

type RoutineItemTemplate = {
  mainId: string
  dailyId: string
  category: RoutineIllustrationCategory
  backgroundColor: string
  main: {
    title: RoutineTextResolver<string>
    time: RoutineTextResolver<string>
    description: RoutineTextResolver<string>
  }
  daily: {
    title: string
    time: string
    descriptions: DailyRoutineDescriptionContent[]
    highlighted?: boolean
    compact?: boolean
  }
}

type MainRoutineSectionTemplate = {
  id: string
  title: string
  status: RoutineStatus
  itemKeys: RoutineItemKey[]
}

type DailyRoutineSectionTemplate = {
  id: string
  highlight: string
  status: RoutineStatus
  itemKeys: RoutineItemKey[]
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

export const ROUTINE_ITEM_TEMPLATES = {
  beforeWorkSleep: {
    mainId: 'main-before-work-sleep',
    dailyId: 'daily-before-work-sleep',
    category: 'sleep',
    backgroundColor: '#F6F3FF',
    main: {
      title: '낮잠',
      time: (routine?: Routine) =>
        routine?.health?.sleepSchedule || '15:00 ~ 20:00',
      description: (routine?: Routine) =>
        routine?.health?.sleepGuide?.join(' ') || '5시간 수면 채운 후 기상',
    },
    daily: {
      title: '낮잠',
      time: '15:00 ~ 20:00',
      descriptions: [
        { prefix: '5~6시간 수면 확보' },
        { prefix: '암막커튼, 귀마개로 수면환경 조성' },
      ],
      compact: true,
    },
  },
  beforeWorkMeal: {
    mainId: 'main-before-work-meal',
    dailyId: 'daily-before-work-meal',
    category: 'meal',
    backgroundColor: '#FFFAF2',
    main: {
      title: (routine?: Routine) => routine?.meals?.[0]?.label || '식사',
      time: (routine?: Routine) => routine?.meals?.[0]?.time || '20:00 ~ 21:00',
      description: (routine?: Routine) => {
        const meal = routine?.meals?.[0]

        return meal
          ? `추천 메뉴: ${meal.items.join(', ')}`
          : '추천 메뉴: 현미밥, 생선구이, 채소'
      },
    },
    daily: {
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
    },
  },
  beforeWorkReady: {
    mainId: 'main-before-work-ready',
    dailyId: 'daily-before-work-ready',
    category: 'readyForWork',
    backgroundColor: '#FFFFF3',
    main: {
      title: '출근 준비',
      time: '21:00 ~ 22:30',
      description: '샤워와 스트레칭하기',
    },
    daily: {
      title: '출근 준비',
      time: '21:00 ~ 22:30',
      descriptions: [
        { prefix: '샤워와 스트레칭으로 각성' },
        { prefix: '밝은 조명 아래 가볍게 몸 깨우기' },
      ],
      compact: true,
    },
  },
  duringWorkFocus: {
    mainId: 'main-during-work-focus',
    dailyId: 'daily-during-work-focus',
    category: 'working',
    backgroundColor: '#F4F5F6',
    main: {
      title: '근무 집중 구간',
      time: '21:00 ~ 22:30',
      description: (routine?: Routine) =>
        `카페인은 ${routine?.health?.fastingSchedule || '01:00 이전'}까지만`,
    },
    daily: {
      title: '근무 집중 구간',
      time: '23:00 ~ 01:00',
      descriptions: [
        { prefix: '카페인은 01시 이전까지만 허용' },
        { prefix: '중간 스트레칭으로 졸음 예방' },
      ],
    },
  },
  duringWorkSnack: {
    mainId: 'main-during-work-snack',
    dailyId: 'daily-during-work-snack',
    category: 'snack',
    backgroundColor: '#EEFFF2',
    main: {
      title: (routine?: Routine) => routine?.meals?.[1]?.label || '간식',
      time: (routine?: Routine) => routine?.meals?.[1]?.time || '01:00 ~ 02:00',
      description: (routine?: Routine) => {
        const snack = routine?.meals?.[1]

        return snack
          ? `추천메뉴: ${snack.items.join(', ')}`
          : '추천메뉴: 연두부, 물'
      },
    },
    daily: {
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
    },
  },
  duringWorkHydration: {
    mainId: 'main-during-work-hydration',
    dailyId: 'daily-during-work-hydration',
    category: 'hydration',
    backgroundColor: '#F0FFFC',
    main: {
      title: '수분 보충',
      time: '03:00 ~ 04:00',
      description: '물 한 잔과 가벼운 움직임',
    },
    daily: {
      title: '공복 유지 + 수분 보충',
      time: '02:00 ~ 06:00',
      descriptions: [
        { prefix: '위 부담 줄이기' },
        { prefix: '물·보리차 중심 수분 보충' },
      ],
    },
  },
  afterWorkMeal: {
    mainId: 'main-after-work-meal',
    dailyId: 'daily-after-work-meal',
    category: 'meal',
    backgroundColor: '#FFFAF2',
    main: {
      title: '귀가 후 식사',
      time: '07:00 ~ 07:30',
      description: '추천 메뉴: 죽, 오트밀',
    },
    daily: {
      title: '귀가 후 식사',
      time: '07:00 ~ 07:30',
      descriptions: [
        { prefix: '추천 메뉴:', emphasis: ' 죽, 오트밀' },
        { prefix: '과식 피하고 따뜻하게 섭취' },
      ],
    },
  },
  afterWorkSleep: {
    mainId: 'main-after-work-sleep',
    dailyId: 'daily-after-work-sleep',
    category: 'sleep',
    backgroundColor: '#F6F3FF',
    main: {
      title: '회복 수면',
      time: '08:00 ~ 13:00',
      description: '5시간 숙면, 조명 낮추고 공복 1시간 유지',
    },
    daily: {
      title: '회복 수면',
      time: '08:00 ~ 13:00',
      descriptions: [
        { prefix: '5시간 숙면, 조명 낮추고 공복 1시간 유지' },
        { prefix: '온도 18~20℃로 쾌적하게' },
      ],
    },
  },
  afterWorkRest: {
    mainId: 'main-after-work-rest',
    dailyId: 'daily-after-work-rest',
    category: 'rest',
    backgroundColor: '#E8FBFF',
    main: {
      title: '리듬 회복',
      time: '13:00 ~ 14:00',
      description: '햇빛 노출 + 가벼운 산책',
    },
    daily: {
      title: '리듬 회복',
      time: '13:00 ~ 14:00',
      descriptions: [
        { prefix: '햇빛 노출 + 가벼운 산책' },
        { prefix: '휴일엔 생체리듬 되돌리기 좋은 시간대' },
      ],
    },
  },
} satisfies Record<string, RoutineItemTemplate>

type RoutineItemKey = keyof typeof ROUTINE_ITEM_TEMPLATES

export const MAIN_ROUTINE_SECTION_TEMPLATES: MainRoutineSectionTemplate[] = [
  {
    id: 'main-before-work',
    title: '근무 전 루틴',
    status: 'done',
    itemKeys: ['beforeWorkSleep', 'beforeWorkMeal', 'beforeWorkReady'],
  },
  {
    id: 'main-during-work',
    title: '근무 중 루틴',
    status: 'current',
    itemKeys: ['duringWorkFocus', 'duringWorkSnack', 'duringWorkHydration'],
  },
  {
    id: 'main-after-work',
    title: '퇴근 후 루틴',
    status: 'ready',
    itemKeys: ['afterWorkMeal', 'afterWorkSleep', 'afterWorkRest'],
  },
]

export const DAILY_ROUTINE_SECTION_TEMPLATES: DailyRoutineSectionTemplate[] = [
  {
    id: 'daily-before-work',
    highlight: ' 출근 전 루틴',
    status: 'done',
    itemKeys: ['beforeWorkSleep', 'beforeWorkMeal', 'beforeWorkReady'],
  },
  {
    id: 'daily-during-work',
    highlight: ' 근무 중 루틴',
    status: 'current',
    itemKeys: ['duringWorkFocus', 'duringWorkSnack', 'duringWorkHydration'],
  },
  {
    id: 'daily-after-work',
    highlight: ' 퇴근 후 루틴',
    status: 'ready',
    itemKeys: ['afterWorkMeal', 'afterWorkSleep', 'afterWorkRest'],
  },
]

export const ROUTINE_CONTENT_SOURCE = {
  items: ROUTINE_ITEM_TEMPLATES,
  mainSections: MAIN_ROUTINE_SECTION_TEMPLATES,
  dailySections: DAILY_ROUTINE_SECTION_TEMPLATES,
}

const resolveRoutineValue = <T>(
  value: RoutineTextResolver<T>,
  routine?: Routine
): T => {
  return typeof value === 'function' ? value(routine) : value
}

const resolveRoutineItemTemplate = (key: RoutineItemKey) =>
  ROUTINE_ITEM_TEMPLATES[key]

const resolveMainRoutineItems = (
  itemKeys: RoutineItemKey[],
  routine?: Routine
): RoutineCardContentItem[] =>
  itemKeys.map(key => {
    const item = resolveRoutineItemTemplate(key)

    return {
      id: item.mainId,
      title: resolveRoutineValue(item.main.title, routine),
      time: resolveRoutineValue(item.main.time, routine),
      description: resolveRoutineValue(item.main.description, routine),
      illustration: getRoutineIllustration(item.category),
      backgroundColor: item.backgroundColor,
    }
  })

const resolveDailyRoutineItems = (
  itemKeys: RoutineItemKey[],
  completedById: RoutineCompletionMap,
  nowMillis: number,
  anchorStartMinutes: number,
  routineDay: RoutineDay
) =>
  itemKeys.map(key => {
    const item = resolveRoutineItemTemplate(key)
    const timeWindow = parseRoutineTimeWindow(item.daily.time)
    const timePosition =
      routineDay === 'today' && timeWindow !== null
        ? getRoutineTimePosition(timeWindow, nowMillis, anchorStartMinutes)
        : 'future'
    const isPast = timePosition === 'past'
    const isCurrentWindow = timePosition === 'current'
    const state: DailyRoutineState =
      completedById[item.dailyId] || isPast ? 'done' : 'todo'

    return {
      id: item.dailyId,
      title: item.daily.title,
      time: item.daily.time,
      descriptions: item.daily.descriptions,
      illustration: getRoutineIllustration(item.category),
      backgroundColor: item.backgroundColor,
      state,
      highlighted: item.daily.highlighted === true || isCurrentWindow,
      faded: isPast,
      compact: item.daily.compact,
      timeWindow: timeWindow ?? {
        startTime: item.daily.time.split('~')[0]?.trim() || '',
        endTime: item.daily.time.split('~')[1]?.trim() || '',
      },
      timePosition,
    }
  })

const getDailyRoutineTimelineStartMinutes = () => {
  const firstSection = DAILY_ROUTINE_SECTION_TEMPLATES[0]
  const firstItemKey = firstSection?.itemKeys[0]
  const firstItem = firstItemKey
    ? resolveRoutineItemTemplate(firstItemKey)
    : null
  const firstTimeWindow = firstItem
    ? parseRoutineTimeWindow(firstItem.daily.time)
    : null
  const firstStartMinutes = firstTimeWindow
    ? parseTimeMinutes(firstTimeWindow.startTime)
    : null

  return firstStartMinutes ?? 0
}

export const buildMainRoutineCards = (
  routine?: Routine
): RoutineCardContent[] => {
  return MAIN_ROUTINE_SECTION_TEMPLATES.map(section => ({
    id: section.id,
    title: section.title,
    status: section.status,
    items: resolveMainRoutineItems(section.itemKeys, routine),
  }))
}

export const buildDailyRoutineSections = ({
  routineDay,
  completionByDay = {
    today: {},
    tomorrow: {},
  },
  nowMillis = Date.now(),
}: {
  routineDay: RoutineDay
  completionByDay?: Record<RoutineDay, RoutineCompletionMap>
  nowMillis?: number
}): DailyRoutineSectionContent[] => {
  const title = getRoutineDayTitle(routineDay)
  const anchorStartMinutes = getDailyRoutineTimelineStartMinutes()
  const completedById = completionByDay[routineDay] ?? {}

  return DAILY_ROUTINE_SECTION_TEMPLATES.map(section => ({
    id: section.id,
    title,
    highlight: section.highlight,
    status: section.status,
    items: resolveDailyRoutineItems(
      section.itemKeys,
      completedById,
      nowMillis,
      anchorStartMinutes,
      routineDay
    ),
  }))
}
