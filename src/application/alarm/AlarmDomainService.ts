import { AutoAlarm } from '../../domain/models/AutoAlarm'
import { getHolidayDateSetUseCase } from '../../infrastructure/di/Dependencies'
import {
  AlarmDraft,
  AlarmWeekdayLabel,
} from '../../presentation/alarm/types/alarmDraft'
import { useCalendarStore } from '../../store/useCalendarStore'
import { useScheduleInfoStore } from '../../store/useScheduleInfoStore'
import { useTeamCalendarStore } from '../../store/useTeamCalendarStore'
import { resolveAutoAlarmNextTriggerAtMillis } from '../../shared/utils/alarm/resolveAutoAlarmNextTriggerAtMillis'
import { createWorkTypeResolver } from '../../shared/utils/alarm/workTypeResolver'
import { AlarmSyncItem } from './types/alarmExecution'

const weekdayIndexToLabel: Record<number, AlarmWeekdayLabel> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
}

const buildResolverContext = () => {
  const calendarData = useCalendarStore.getState().calendarData
  const teamCalendarData = useTeamCalendarStore.getState().teamCalendarData
  const currentTeam =
    useScheduleInfoStore.getState().workGroup ||
    useTeamCalendarStore.getState().myTeam

  return createWorkTypeResolver({
    calendarData,
    teamCalendarData,
    currentTeam,
  })
}

export const resolveNextTriggerAtMillisForDraft = async (
  draft: AlarmDraft
): Promise<number> => {
  const resolveWorkTypeForDate = buildResolverContext()
  const nextTriggerAtMillis = await resolveAutoAlarmNextTriggerAtMillis({
    alarmTime: draft.alarmTime,
    selectedDays: draft.selectedDays,
    selectedWorkType: draft.selectedWorkType,
    isHolidayAlarmOff: draft.isHolidayAlarmOff,
    getHolidayDateSet: year => getHolidayDateSetUseCase.execute(year),
    resolveWorkTypeForDate,
  })

  if (nextTriggerAtMillis === null) {
    throw new Error(
      '조건을 만족하는 다음 알람 시간을 찾을 수 없습니다. 근무 일정, 요일, 공휴일 조건을 확인해 주세요.'
    )
  }

  return nextTriggerAtMillis
}

export const resolveNextTriggerAtMillisForAutoAlarm = async (
  autoAlarm: AutoAlarm
): Promise<number> => {
  const alarmTime = new Date()
  alarmTime.setHours(autoAlarm.time.hour, autoAlarm.time.minute, 0, 0)

  return resolveNextTriggerAtMillisForDraft({
    id: autoAlarm.id,
    alarmTime,
    selectedWorkType: autoAlarm.workTypeTitle,
    selectedDays: autoAlarm.weekdays
      .map(weekday => weekdayIndexToLabel[weekday])
      .filter((weekday): weekday is AlarmWeekdayLabel => weekday !== undefined),
    isHolidayAlarmOff: autoAlarm.isHolidayDisabled,
    snoozeSetting: {
      enabled: autoAlarm.snooze.enabled,
      intervalMinutes: autoAlarm.snooze.intervalMinutes as 1 | 3 | 5 | 10 | 15,
      repeatCount:
        autoAlarm.snooze.repeatCount === 0
          ? 'infinite'
          : (autoAlarm.snooze.repeatCount as 1 | 3 | 5 | 10),
    },
    isEnabled: autoAlarm.isEnabled,
  })
}

export const toAlarmSyncItem = (
  autoAlarm: AutoAlarm,
  overrides?: Partial<AlarmSyncItem>
): AlarmSyncItem => {
  const baseSnoozeConfig = {
    enabled: autoAlarm.snooze.enabled,
    intervalMinutes: autoAlarm.snooze.intervalMinutes,
    repeatCount: autoAlarm.snooze.repeatCount,
    remainingCount:
      autoAlarm.snooze.enabled && autoAlarm.snooze.repeatCount === 0
        ? null
        : autoAlarm.snooze.repeatCount,
  }

  return {
    alarmId: autoAlarm.id,
    nextTriggerAtMillis: autoAlarm.nextTriggerAtMillis,
    isEnabled: autoAlarm.isEnabled,
    ...overrides,
    snooze: {
      ...baseSnoozeConfig,
      ...overrides?.snooze,
    },
  }
}
