import { ShiftType, WorkDay } from '../../../../data/model/Calendar'
import dayjs from 'dayjs'

// 근무표 정보 조회하기
// rawData를 formatted 된 예시 데이터 형식으로.
export const workDaysToMap = (
  workDays: WorkDay[],
  year: number,
  month: number
): Map<string, ShiftType> => {
  const map = new Map<string, ShiftType>()

  workDays.forEach(({ day, shift }) => {
    const dateStr = dayjs(
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    ).format('YYYY-MM-DD')
    map.set(dateStr, shift)
  })

  return map
}
