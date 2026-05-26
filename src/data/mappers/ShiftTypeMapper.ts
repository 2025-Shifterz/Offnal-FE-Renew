import { ShiftType, ShiftCode } from '../../shared/types/Calendar'

export function toShiftType(code: string): ShiftType {
  switch (code) {
    case 'D':
      return '주간'
    case 'E':
      return '오후'
    case 'N':
      return '야간'
    case '-':
      return '휴일'
    case '':
      return '근무 없음'
    default:
      return '휴일'
  }
}

/**
 * WorkType을 API가 요구하는 문자열('오전', '휴무' 등)로 변환하는 헬퍼 함수
 */
export function fromShiftType(shift: ShiftType): ShiftCode {
  switch (shift) {
    case '주간':
      return 'D'
    case '오후':
      return 'E'
    case '야간':
      return 'N'
    case '휴일':
      return '-'
    case '근무 없음':
      return ''
  }
}
