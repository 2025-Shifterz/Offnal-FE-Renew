import { AutoAlarm } from '../../../domain/models/AutoAlarm'
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

const formatRemainingTime = (nextTriggerAtMillis: number): string => {
  const remainingMillis = Math.max(0, nextTriggerAtMillis - Date.now())
  const totalMinutes = Math.floor(remainingMillis / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0 && minutes === 0) {
    return '지금'
  }

  if (hours === 0) {
    return `${minutes}분 후`
  }

  if (minutes === 0) {
    return `${hours}시간 후`
  }

  return `${hours}시간 ${minutes}분 후`
}

export const toAlarmListItem = (alarm: AutoAlarm): AlarmListItem => {
  return {
    id: String(alarm.id),
    shiftType: toAlarmListShiftType(alarm.workTypeTitle),
    etaText: formatRemainingTime(alarm.nextTriggerAtMillis),
    meridiem: toAlarmListMeridiem(alarm.time.hour),
    time: formatAlarmTime(alarm.time.hour, alarm.time.minute),
    enabled: alarm.isEnabled,
  }
}

export const toAlarmListItemArray = (alarms: AutoAlarm[]): AlarmListItem[] => {
  return alarms.map(toAlarmListItem)
}
