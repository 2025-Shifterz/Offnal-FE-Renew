import {
  getWorkTypeLabel,
  getWorkTypeMeta,
  normalizeWorkTypeCode,
} from '../../../src/shared/constants/workType'

describe('workType helpers', () => {
  it('normalizes current work type codes', () => {
    expect(normalizeWorkTypeCode('DAY')).toBe('DAY')
    expect(normalizeWorkTypeCode('EVENING')).toBe('EVENING')
    expect(normalizeWorkTypeCode('NIGHT')).toBe('NIGHT')
    expect(normalizeWorkTypeCode('OFF')).toBe('OFF')
  })

  it('normalizes legacy labels to work type codes', () => {
    expect(normalizeWorkTypeCode('주간 근무')).toBe('DAY')
    expect(normalizeWorkTypeCode('오후')).toBe('EVENING')
    expect(normalizeWorkTypeCode('야간 근무')).toBe('NIGHT')
    expect(normalizeWorkTypeCode('휴무')).toBe('OFF')
  })

  it('falls back to unregistered for unknown values', () => {
    expect(normalizeWorkTypeCode('UNKNOWN')).toBeNull()
    expect(getWorkTypeLabel('UNKNOWN')).toBe('미등록')
    expect(getWorkTypeMeta('UNKNOWN').label).toBe('미등록')
  })

  it('returns localized labels for known codes', () => {
    expect(getWorkTypeLabel('DAY')).toBe('주간 근무')
    expect(getWorkTypeLabel('EVENING')).toBe('오후 근무')
    expect(getWorkTypeLabel('NIGHT')).toBe('야간 근무')
    expect(getWorkTypeLabel('OFF')).toBe('휴일')
  })
})
