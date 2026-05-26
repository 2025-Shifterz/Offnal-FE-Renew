import type { ShiftType } from '../../domain/models/Calendar'
export type { ShiftType } from '../../domain/models/Calendar'

/**
 * ### ShiftCode
 *
 * 이 열거형은 서버에서 전달받은 ShiftCode를 나타냅니다.
 * D: 주간
 * E: 오후
 * N: 야간
 * -: 휴일
 * '': 근무 없음
 */
export type ShiftCode = 'D' | 'E' | 'N' | '-' | ''

/**
 * ### ShiftTypeInfo
 *
 * 이 객체는 `DateAndShiftTypeRecord` 객체의 값으로 사용되는 객체입니다.
 *
 * @property shiftTypeName - `ShiftType` 열거형에 속하는 값입니다.
 * @property startTime - HH:MM 형식의 근무 시작 시간 문자열입니다.
 * @property endTime - HH:MM 형식의 근무 종료 시간 문자열입니다.
 *
 * @remarks
 * `shiftTypeName`은 서버에서 전달받은 ShiftCode를 `toShiftType` 함수를 통해 `ShiftType`으로 변환한 값입니다.
 * `startTime`과 `endTime`은 `startTime` 필드의 값과 `endTime` 필드의 값으로, 휴가나 병가 등의 정보를 표현할 때 사용될 수 있습니다.
 */
export interface ShiftTypeInfo {
  shiftTypeName: ShiftType
  startTime?: string
  endTime?: string
}

/**
 * ### DateAndShiftTypeRecord
 *
 * 이 객체는 "YYYY-MM-DD" 형식의 날짜 문자열을 키로 하고, `ShiftTypeInfo` 객체를 값으로 가지는 매핑 객체입니다.
 * 이 객체는 "YYYY-MM-DD" → ShiftTypeInfo 형태의 매핑을 위해 사용되며, 프론트엔드에서 캘린더 데이터를 다룰 때 사용됩니다.
 *
 * @property date - "YYYY-MM-DD" 형식의 날짜 문자열
 * @property shiftTypeInfo - `ShiftTypeInfo` 객체
 *
 * @remarks
 * 이 객체는 "YYYY-MM-DD" → ShiftTypeInfo 형태의 매핑을 위해 사용되며, 프론트엔드에서 캘린더 데이터를 다룰 때 사용됩니다.
 */
export type DateAndShiftTypeRecord = Record<string, ShiftTypeInfo>

/**
 * ### DateAndShiftType
 *
 * 이 객체는 달력의 각 날짜에 대한 정보를 담고 있습니다.
 * 이 객체는 calendarData 형식으로 저장하기 위한 원시 데이터 형태입니다.
 *
 * @property date - "YYYY-MM-DD" 형식의 날짜 문자열입니다.
 * @property shiftTypeName - `ShiftType` 열거형에 속하는 값입니다.
 * @property startTime - HH:MM 형식의 근무 시작 시간 문자열입니다.
 * @property endTime - HH:MM 형식의 근무 종료 시간 문자열입니다.
 *
 * @remarks
 * `shiftTypeName`은 서버에서 전달받은 ShiftCode를 `toShiftType` 함수를 통해 `ShiftType`으로 변환한 값입니다.
 * `startTime`과 `endTime`은 `startTime` 필드의 값과 `endTime` 필드의 값으로, 휴가나 병가 등의 정보를 표현할 때 사용될 수 있습니다.
 */
export interface DateAndShiftType {
  date: string // "YYYY-MM-DD"
  shiftTypeName: ShiftType
  startTime: string
  endTime: string
}
