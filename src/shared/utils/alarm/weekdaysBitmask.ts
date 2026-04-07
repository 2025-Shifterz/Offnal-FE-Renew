/* eslint-disable no-bitwise */

/**
 * 요일 배열을 SQLite 저장용 비트마스크로 변환합니다.
 *
 * 인덱스 기준:
 * 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
 */
export const encodeWeekdaysToBitmask = (weekdays: number[]): number => {
  return weekdays.reduce((mask, weekday) => {
    if (weekday < 0 || weekday > 6) {
      return mask
    }

    return mask | (1 << weekday)
  }, 0)
}

/**
 * 비트마스크를 요일 배열로 복원합니다.
 *
 * 인덱스 기준:
 * 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
 */
export const decodeWeekdaysFromBitmask = (mask: number): number[] => {
  const weekdays: number[] = []

  for (let weekday = 0; weekday <= 6; weekday += 1) {
    if ((mask & (1 << weekday)) !== 0) {
      weekdays.push(weekday)
    }
  }

  return weekdays
}
