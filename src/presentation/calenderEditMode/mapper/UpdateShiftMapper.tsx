import { fromShiftType } from '../../../data/mappers/ShiftTypeMapper'
import { DateAndShiftTypeRecord } from '../../../shared/types/Calendar'

// 근무표 수정 request 형식 맞춤 Mapper
export function toUpdateShiftRecord(calendarData: DateAndShiftTypeRecord) {
  const shifts: Record<string, string> = {}

  Object.entries(calendarData).forEach(([date, info]) => {
    shifts[date] = fromShiftType(info.shiftTypeName)
  })

  return { shifts }
}
