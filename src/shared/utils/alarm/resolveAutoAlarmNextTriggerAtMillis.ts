import { WorkType } from '../../../domain/models/Calendar'
import { AlarmWeekdayLabel } from '../../../presentation/alarm/types/alarmDraft'
import { resolveNextTriggerAtMillis } from './nextTriggerAtMillis'

export interface ResolveHolidayDateSetInput {
  isHolidayAlarmOff: boolean
  getHolidayDateSet: (year: string) => Promise<Set<string>>
}

export const resolveHolidayDateSet = async ({
  isHolidayAlarmOff,
  getHolidayDateSet,
}: ResolveHolidayDateSetInput): Promise<Set<string>> => {
  if (!isHolidayAlarmOff) {
    return new Set()
  }

  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1

  const [currentYearHolidays, nextYearHolidays] = await Promise.all([
    getHolidayDateSet(String(currentYear)),
    getHolidayDateSet(String(nextYear)),
  ])

  return new Set([...currentYearHolidays, ...nextYearHolidays])
}

export interface ResolveAutoAlarmNextTriggerAtMillisInput {
  now?: Date
  alarmTime: Date
  selectedDays: AlarmWeekdayLabel[]
  selectedWorkType: WorkType
  isHolidayAlarmOff: boolean
  getHolidayDateSet: (year: string) => Promise<Set<string>>
  resolveWorkTypeForDate: (dateKey: string) => WorkType | null
}

export const resolveAutoAlarmNextTriggerAtMillis = async ({
  now = new Date(),
  alarmTime,
  selectedDays,
  selectedWorkType,
  isHolidayAlarmOff,
  getHolidayDateSet,
  resolveWorkTypeForDate,
}: ResolveAutoAlarmNextTriggerAtMillisInput): Promise<number | null> => {
  const holidayDateSet = await resolveHolidayDateSet({
    isHolidayAlarmOff,
    getHolidayDateSet,
  })

  return resolveNextTriggerAtMillis({
    now,
    alarmTime,
    selectedDays,
    selectedWorkType,
    isHolidayAlarmOff,
    holidayDateSet,
    resolveWorkTypeForDate,
  })
}
