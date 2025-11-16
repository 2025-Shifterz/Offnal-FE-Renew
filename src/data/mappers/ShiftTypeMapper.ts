import { WorkType, WorkTypeEn } from '../../shared/types/Calendar'

export function fromCodetoShiftType(code: string): WorkType {
  switch (code) {
    case '주간':
      return '주간'
    case '오후':
      return '오후'
    case '야간':
      return '야간'
    case '휴일':
      return '휴일'
    default:
      return '휴일'
  }
}

export function toShiftType(code: string): WorkType {
  switch (code) {
    case 'D':
      return '주간'
    case 'E':
      return '오후'
    case 'N':
      return '야간'
    case '-':
      return '휴일'
    default:
      return '휴일'
  }
}

/**
 * WorkType을 API가 요구하는 문자열('오전', '휴무' 등)로 변환하는 헬퍼 함수
 */
export function fromShiftType(shift: WorkType): string {
  switch (shift) {
    case '주간':
      return 'D'
    case '오후':
      return 'E'
    case '야간':
      return 'N'
    case '휴일':
      return '-'
    default:
      return '휴일'
  }
}

// 문자열을 ShiftType으로 변환하는 헬퍼 함수
export function toDataShiftType(value: string): WorkTypeEn {
  switch (value) {
    case 'D':
      return 'D'
    case 'E':
      return 'E'
    case 'N':
      return 'N'
    case '-':
      return '-'
    default:
      return '-'
  }
}
