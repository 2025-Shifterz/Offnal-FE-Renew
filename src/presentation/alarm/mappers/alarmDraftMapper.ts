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

const toStoredRepeatCount = (repeatCount: AlarmSnoozeRepeatCount): number => {
  return repeatCount === 'infinite' ? 0 : repeatCount
}

const normalizeWeekdays = (selectedDays: AlarmWeekdayLabel[]): number[] => {
  const weekdayLabelToIndex: Record<AlarmWeekdayLabel, number> = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  }

  return Array.from(
    new Set(selectedDays.map(day => weekdayLabelToIndex[day]))
  ).sort((left, right) => left - right)
}

const buildAutoAlarmWriteInput = (
  draft: AlarmDraft,
  nextTriggerAtMillis: number
): CreateAutoAlarmInput => ({
  hour: draft.alarmTime.getHours(),
  minute: draft.alarmTime.getMinutes(),
  workTypeTitle: draft.selectedWorkType,
  weekdays: normalizeWeekdays(draft.selectedDays),
  isEnabled: draft.isEnabled,
  isHolidayDisabled: draft.isHolidayAlarmOff,
  isSnoozeEnabled: draft.snoozeSetting.enabled,
  snoozeIntervalMinutes: draft.snoozeSetting.intervalMinutes,
  snoozeRepeatCount: toStoredRepeatCount(draft.snoozeSetting.repeatCount),
  nextTriggerAtMillis,
})

export const toCreateAutoAlarmInput = (
  draft: CreateAutoAlarmDraft,
  nextTriggerAtMillis: number
): CreateAutoAlarmInput => buildAutoAlarmWriteInput(draft, nextTriggerAtMillis)

export const toUpdateAutoAlarmInput = (
  draft: UpdateAutoAlarmDraft,
  nextTriggerAtMillis: number
): UpdateAutoAlarmInput => ({
  id: draft.id,
  ...buildAutoAlarmWriteInput(draft, nextTriggerAtMillis),
})
