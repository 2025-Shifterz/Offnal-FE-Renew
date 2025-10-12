// /src/data/mappers/CalendarMapper.ts

import { NewCalendar, ShiftsMap, ShiftType, WorkDay } from '../model/Calendar' // Domain 모델
import { GetWorkCalendarResponseData } from '../../remote/response/GetWorkCalendarResponse'
import { UpdateShiftsRequest } from '../../remote/request/PatchWorkCalendarReqeust'
import { CreateCalendarRequest } from '../../remote/request/CreateWorkCalendarRequest'

export function fromCodetoShiftType(code: string): ShiftType {
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
    default:
      return '휴일'
  }
}

/**
 * API 응답 데이터 배열을 Domain 모델(WorkDay) 배열로 변환하는 메인 매퍼 함수
 * @param apiData GetWorkCalendarResponseData[] 형태의 API 원본 데이터 배열
 * @returns WorkDay[] 형태의 Domain 모델 배열
 */
export function toWorkDayModels(
  apiData: GetWorkCalendarResponseData[]
): WorkDay[] {
  if (!apiData) {
    return [] // apiData가 null 또는 undefined일 경우 빈 배열 반환
  }

  return apiData.map(item => ({
    day: parseInt(item.day, 10), // 문자열을 10진수 숫자로 변환
    shift: fromCodetoShiftType(item.workTypeName), // 문자열을 Enum으로 변환
  }))
}

/**
 * ShiftType(enum)을 API가 요구하는 문자열('오전', '휴무' 등)로 변환하는 헬퍼 함수
 */
export function fromShiftType(shift: ShiftType): string {
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

/**
 * ShiftsMap(data model)을 UpdateShiftsRequest(Request)로 변환합니다.
 * @param shiftsMap Domain에서 사용하는 수정될 근무 맵
 * @returns API 요청에 사용될 객체
 */
export function toUpdateShiftsRequest(
  shiftsMap: ShiftsMap
): UpdateShiftsRequest {
  const shifts: { [day: string]: string } = {}

  // Map을 순회하며 { "1": "오후", "2": "야간" } 형태의 객체로 변환
  shiftsMap.forEach((shift, day) => {
    // day가 20250720처럼 연월일이면, 마지막 2자리(혹은 1~2자리)를 추출
    const dayStr = day.toString()
    // "20250720" → "20", "20250721" → "21"
    const onlyDay = dayStr.length > 2 ? dayStr.slice(-2) : dayStr
    shifts[onlyDay] = fromShiftType(shift)
  })

  return { shifts }
}

/**
 * NewCalendar(data 모델)를 CreateCalendarRequest(Request)로 변환합니다.
 * @param newCalendar Domain에서 사용하는 새 캘린더 객체
 * @returns API 생성 요청에 사용될 객체
 */
export function toCreateCalendarRequest(
  newCalendar: NewCalendar
): CreateCalendarRequest {
  // data의 shiftTimes(Map)를 API의 workTimes(객체)로 변환
  const workTimes: { [key: string]: { startTime: string; endTime: string } } =
    {}
  newCalendar.shiftTimes.forEach((timeDetail, shiftType) => {
    workTimes[fromShiftType(shiftType)] = timeDetail
  })

  // data의 schedules(MonthlySchedule[])를 API의 calendars(MonthlyShift[])로 변환
  const calendars = newCalendar.schedules.map(schedule => {
    const shifts: { [day: string]: string } = {}
    schedule.shifts.forEach((shift, day) => {
      shifts[day.toString()] = fromShiftType(shift)
    })

    return {
      year: schedule.year.toString(),
      month: schedule.month.toString(),
      shifts,
    }
  })

  return {
    calendarName: newCalendar.name,
    workGroup: newCalendar.group,
    workTimes,
    calendars,
  }
}

// DATA REPO 사용을 위한 변경함수

export type ShiftDataType = 'D' | 'E' | 'N' | 'OFF'
export type ShiftsDataMap = Map<number, ShiftDataType>

// 문자열을 ShiftType으로 변환하는 헬퍼 함수
function toDataShiftType(value: string): ShiftDataType | null {
  switch (value) {
    case 'D':
      return 'D'
    case 'E':
      return 'E'
    case 'N':
      return 'N'
    case '_':
    case '-':
    case '':
      return 'OFF'
    default:
      return 'OFF'
  }
}
