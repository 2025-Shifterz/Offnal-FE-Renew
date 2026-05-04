import type { ComponentType } from 'react'
import type { SvgProps } from 'react-native-svg'

import DayWorkIcon from '../../assets/icons/ic_today_work_24.svg'
import NightWorkIcon from '../../assets/icons/ic_night-work.svg'

export const WORK_TYPE_CODES = ['DAY', 'EVENING', 'NIGHT', 'OFF'] as const

export type WorkTypeCode = (typeof WORK_TYPE_CODES)[number]

export type WorkTypeMeta = {
  label: string
  Icon: ComponentType<SvgProps>
}

const DEFAULT_WORK_TYPE_META: WorkTypeMeta = {
  label: '미등록',
  Icon: NightWorkIcon,
}

const WORK_TYPE_META_BY_CODE: Record<WorkTypeCode, WorkTypeMeta> = {
  DAY: {
    label: '주간 근무',
    Icon: DayWorkIcon,
  },
  EVENING: {
    label: '오후 근무',
    Icon: NightWorkIcon,
  },
  NIGHT: {
    label: '야간 근무',
    Icon: NightWorkIcon,
  },
  OFF: {
    label: '휴일',
    Icon: NightWorkIcon,
  },
}

const LEGACY_WORK_TYPE_LABEL_TO_CODE: Record<string, WorkTypeCode> = {
  주간: 'DAY',
  '주간 근무': 'DAY',
  오후: 'EVENING',
  '오후 근무': 'EVENING',
  야간: 'NIGHT',
  '야간 근무': 'NIGHT',
  휴일: 'OFF',
  휴무: 'OFF',
}

export const normalizeWorkTypeCode = (
  value?: string | null
): WorkTypeCode | null => {
  if (!value) return null

  if (WORK_TYPE_CODES.includes(value as WorkTypeCode)) {
    return value as WorkTypeCode
  }

  return LEGACY_WORK_TYPE_LABEL_TO_CODE[value] ?? null
}

export const getWorkTypeMeta = (value?: string | null): WorkTypeMeta => {
  const normalized = normalizeWorkTypeCode(value)

  if (!normalized) {
    return DEFAULT_WORK_TYPE_META
  }

  return WORK_TYPE_META_BY_CODE[normalized]
}

export const getWorkTypeLabel = (value?: string | null): string => {
  return getWorkTypeMeta(value).label
}
