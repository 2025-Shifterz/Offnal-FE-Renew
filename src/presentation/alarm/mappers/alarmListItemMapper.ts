import { AutoAlarm } from '../../../domain/models/AutoAlarm'
import { formatRemainingTime } from '../../../shared/utils/alarm/formatRemainingTime'
import {
  AlarmListItem,
  AlarmListMeridiem,
  AlarmListShiftType,
} from '../types/alarmListItem'

const shiftTypes = new Set<AlarmListShiftType>(['주간', '오후', '야간', '휴일'])

const toAlarmListShiftType = (value: string): AlarmListShiftType => {
  return shiftTypes.has(value as AlarmListShiftType)
    ? (value as AlarmListShiftType)
    : '주간'
}

const toAlarmListMeridiem = (hour: number): AlarmListMeridiem => {
  return hour < 12 ? '오전' : '오후'
}

const formatAlarmTime = (hour: number, minute: number): string => {
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12

  return `${normalizedHour}:${minute.toString().padStart(2, '0')}`
}

export const toAlarmListItem = (
  alarm: AutoAlarm,
  referenceMillis: number = Date.now()
): AlarmListItem => {
  const remainingMillis = alarm.nextTriggerAtMillis - referenceMillis

  return {
    id: String(alarm.id),
    shiftType: toAlarmListShiftType(alarm.workTypeTitle),
    etaText:
      remainingMillis < 0
        ? ''
        : formatRemainingTime(alarm.nextTriggerAtMillis, referenceMillis),
    remainingMillis,
    meridiem: toAlarmListMeridiem(alarm.time.hour),
    time: formatAlarmTime(alarm.time.hour, alarm.time.minute),
    enabled: alarm.isEnabled,
  }
}

export const toAlarmListItemArray = (
  alarms: AutoAlarm[],
  referenceMillis: number = Date.now()
): AlarmListItem[] => {
  return alarms.map(alarm => toAlarmListItem(alarm, referenceMillis))
}
