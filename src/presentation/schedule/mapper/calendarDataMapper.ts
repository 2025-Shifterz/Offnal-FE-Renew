import { toShiftType } from '../../../data/mappers/ShiftTypeMapper'
import dayjs from 'dayjs'
import { WorkType } from '../../../shared/types/Calendar'

export function convertOCRResultToPersonalSchduleData(
  year: number,
  month: number,
  workGroupString: string,
  ocrResult: [string, Record<string, string>]
): Map<string, WorkType> {
  const personalCalendarData = new Map<string, WorkType>()
  const cleanWorkGroup = workGroupString.replace('조', '')

  const foundSheet = ocrResult.find(([workGroupNumber]) => {
    return workGroupNumber === cleanWorkGroup
  })

  if (!foundSheet) {
    console.warn(`Work group '${workGroupString}' not found in OCR result.`)
    return personalCalendarData
  }

  const [, shiftsRecord] = foundSheet
  const targetMonthStart = dayjs()
    .year(year)
    .month(month - 1)
    .startOf('month')
  const daysInTargetMonth = targetMonthStart.daysInMonth()

  for (const dateString in shiftsRecord) {
    if (Object.prototype.hasOwnProperty.call(shiftsRecord, dateString)) {
      const shiftCode = toShiftType(shiftsRecord[dateString])
      const dayOfMonth = parseInt(dateString, 10)

      if (
        isNaN(dayOfMonth) ||
        dayOfMonth < 1 ||
        dayOfMonth > daysInTargetMonth
      ) {
        continue
      }

      if (shiftCode === undefined) {
        continue
      }

      const fullDate = dayjs()
        .year(year)
        .month(month - 1)
        .date(dayOfMonth)

      personalCalendarData.set(fullDate.format('YYYY-MM-DD'), shiftCode)
    }
  }

  return personalCalendarData
}
