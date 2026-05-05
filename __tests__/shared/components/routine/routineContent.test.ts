import {
  buildDailyRoutineSections,
  buildMainRoutineCards,
  getRoutineDayTitle,
  isRoutineTimeWindowActive,
  parseRoutineTimeWindow,
} from '../../../../src/shared/components/routine/routineContent'

describe('routineContent', () => {
  it('parses routine time windows from display labels', () => {
    expect(parseRoutineTimeWindow('15:00 ~ 20:00')).toEqual({
      startTime: '15:00',
      endTime: '20:00',
    })
    expect(parseRoutineTimeWindow('23:00 ~ 01:00')).toEqual({
      startTime: '23:00',
      endTime: '01:00',
    })
  })

  it('detects active time windows including midnight crossover', () => {
    expect(
      isRoutineTimeWindowActive(
        { startTime: '15:00', endTime: '20:00' },
        new Date(2025, 0, 1, 16, 0).getTime()
      )
    ).toBe(true)

    expect(
      isRoutineTimeWindowActive(
        { startTime: '23:00', endTime: '01:00' },
        new Date(2025, 0, 2, 0, 30).getTime()
      )
    ).toBe(true)

    expect(
      isRoutineTimeWindowActive(
        { startTime: '23:00', endTime: '01:00' },
        new Date(2025, 0, 1, 2, 0).getTime()
      )
    ).toBe(false)
  })

  it('builds daily routine sections with time-based done/todo states and highlight', () => {
    const nowMillis = new Date(2025, 0, 1, 23, 30).getTime()
    const sections = buildDailyRoutineSections({
      routineDay: 'today',
      nowMillis,
      completedById: {
        'daily-before-work-meal': true,
        'daily-during-work-focus': true,
      },
    })

    expect(getRoutineDayTitle('today')).toBe('오늘 나의')
    expect(sections).toHaveLength(3)
    expect(sections[0]).toMatchObject({
      id: 'daily-before-work',
      title: '오늘 나의',
      highlight: ' 출근 전 루틴',
    })
    expect(sections[0].items[1]).toMatchObject({
      id: 'daily-before-work-meal',
      state: 'done',
      highlighted: false,
      faded: true,
      timePosition: 'past',
    })
    expect(sections[0].items[0]).toMatchObject({
      id: 'daily-before-work-sleep',
      state: 'done',
      highlighted: false,
      faded: true,
      timePosition: 'past',
    })
    expect(sections[1].items[0]).toMatchObject({
      id: 'daily-during-work-focus',
      state: 'done',
      highlighted: true,
      faded: false,
      timePosition: 'current',
    })
    expect(sections[2].items[0]).toMatchObject({
      id: 'daily-after-work-meal',
      state: 'todo',
      highlighted: false,
      faded: false,
      timePosition: 'future',
    })
  })

  it('builds main routine cards from routine data', () => {
    const cards = buildMainRoutineCards({
      meals: [
        {
          label: '식사',
          time: '20:00 ~ 21:00',
          description: '균형식',
          items: ['현미밥', '생선구이'],
        },
        {
          label: '간식',
          time: '01:00 ~ 02:00',
          description: '간단식',
          items: ['두유'],
        },
      ],
      health: {
        fastingComment: '금식',
        fastingSchedule: '01:00 이전',
        sleepGuide: ['5시간', '숙면'],
        sleepSchedule: '15:00 ~ 20:00',
      },
    })

    expect(cards).toHaveLength(2)
    expect(cards[0]).toMatchObject({
      id: 'main-before-work',
      title: '근무 전 루틴',
      status: 'done',
    })
    expect(cards[0].items[0]).toMatchObject({
      id: 'main-before-work-sleep',
      illustration: 'bed',
    })
    expect(cards[1].items[1]).toMatchObject({
      id: 'main-during-work-snack',
      illustration: 'snack',
    })
  })
})
