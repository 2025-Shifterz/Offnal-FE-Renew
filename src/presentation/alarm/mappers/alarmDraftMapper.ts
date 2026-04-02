import {
  CreateAutoAlarmInput,
  UpdateAutoAlarmInput,
} from '../../../domain/repositories/AutoAlarmRepository'
import {
  AlarmDraft,
  AlarmSnoozeRepeatCount,
  AlarmWeekdayLabel,
  CreateAutoAlarmDraft,
  UpdateAutoAlarmDraft,
} from '../types/alarmDraft'

const weekdayLabelToIndex: Record<AlarmWeekdayLabel, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
}

const normalizeWeekdays = (selectedDays: AlarmWeekdayLabel[]): number[] => {
  return Array.from(
    new Set(selectedDays.map(day => weekdayLabelToIndex[day]))
  ).sort((left, right) => left - right)
}

const toStoredRepeatCount = (repeatCount: AlarmSnoozeRepeatCount): number => {
  return repeatCount === 'infinite' ? 0 : repeatCount
}

const resolveNextTriggerAtMillis = (
  alarmTime: AlarmDraft['alarmTime'],
  selectedDays: AlarmWeekdayLabel[]
): number => {
  const now = new Date()
  const targetHour = alarmTime.getHours()
  const targetMinute = alarmTime.getMinutes()
  const normalizedWeekdays =
    selectedDays.length > 0
      ? normalizeWeekdays(selectedDays)
      : [0, 1, 2, 3, 4, 5, 6]

  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = new Date(now)
    candidate.setDate(now.getDate() + offset)
    candidate.setHours(targetHour, targetMinute, 0, 0)

    if (!normalizedWeekdays.includes(candidate.getDay())) {
      continue
    }

    if (candidate.getTime() >= now.getTime()) {
      return candidate.getTime()
    }
  }

  const fallback = new Date(now)
  fallback.setDate(now.getDate() + 7)
  fallback.setHours(targetHour, targetMinute, 0, 0)

  return fallback.getTime()
}

const buildAutoAlarmWriteInput = (draft: AlarmDraft): CreateAutoAlarmInput => ({
  hour: draft.alarmTime.getHours(),
  minute: draft.alarmTime.getMinutes(),
  workTypeTitle: draft.selectedWorkType,
  weekdays: normalizeWeekdays(draft.selectedDays),
  isEnabled: draft.isEnabled,
  isHolidayDisabled: draft.isHolidayAlarmOff,
  isSnoozeEnabled: draft.snoozeSetting.enabled,
  snoozeIntervalMinutes: draft.snoozeSetting.intervalMinutes,
  snoozeRepeatCount: toStoredRepeatCount(draft.snoozeSetting.repeatCount),
  nextTriggerAtMillis: resolveNextTriggerAtMillis(
    draft.alarmTime,
    draft.selectedDays
  ),
})

export const toCreateAutoAlarmInput = (
  draft: CreateAutoAlarmDraft
): CreateAutoAlarmInput => buildAutoAlarmWriteInput(draft)

export const toUpdateAutoAlarmInput = (
  draft: UpdateAutoAlarmDraft
): UpdateAutoAlarmInput => ({
  id: draft.id,
  ...buildAutoAlarmWriteInput(draft),
})
