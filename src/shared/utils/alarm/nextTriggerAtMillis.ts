import dayjs from 'dayjs'
import { WorkType } from '../../../domain/models/Calendar'
import { AlarmWeekdayLabel } from '../../../presentation/alarm/types/alarmDraft'

const allWeekdays: AlarmWeekdayLabel[] = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
]

const weekdayToIndex: Record<AlarmWeekdayLabel, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
}

const normalizeWeekdays = (selectedDays: AlarmWeekdayLabel[]): number[] => {
  const source = selectedDays.length > 0 ? selectedDays : allWeekdays
  return Array.from(new Set(source.map(day => weekdayToIndex[day]))).sort(
    (left, right) => left - right
  )
}

export interface ResolveNextTriggerAtMillisInput {
  now: Date
  alarmTime: Date
  selectedDays: AlarmWeekdayLabel[]
  selectedWorkType: WorkType
  isHolidayAlarmOff: boolean
  holidayDateSet: Set<string>
  resolveWorkTypeForDate: (dateKey: string) => WorkType | null
}

export const resolveNextTriggerAtMillis = ({
  now,
  alarmTime,
  selectedDays,
  selectedWorkType,
  isHolidayAlarmOff,
  holidayDateSet,
  resolveWorkTypeForDate,
}: ResolveNextTriggerAtMillisInput): number | null => {
  const targetHour = alarmTime.getHours()
  const targetMinute = alarmTime.getMinutes()
  const normalizedWeekdays = normalizeWeekdays(selectedDays)
  const nowMillis = now.getTime()

  for (let offset = 0; offset <= 365; offset += 1) {
    const candidateDate = dayjs(now).add(offset, 'day')
    const dateKey = candidateDate.format('YYYY-MM-DD')

    if (isHolidayAlarmOff && holidayDateSet.has(dateKey)) {
      continue
    }

    if (!normalizedWeekdays.includes(candidateDate.day())) {
      continue
    }

    const workTypeForDate = resolveWorkTypeForDate(dateKey)
    if (!workTypeForDate || workTypeForDate !== selectedWorkType) {
      continue
    }

    const candidate = candidateDate
      .hour(targetHour)
      .minute(targetMinute)
      .second(0)
      .millisecond(0)

    if (candidate.valueOf() <= nowMillis) {
      continue
    }

    return candidate.valueOf()
  }

  return null
}
