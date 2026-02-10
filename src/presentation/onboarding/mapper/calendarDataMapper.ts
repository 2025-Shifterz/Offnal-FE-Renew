import { toShiftType } from '../../../data/mappers/ShiftTypeMapper'
import dayjs from 'dayjs'
import { WorkType } from '../../../shared/types/Calendar'

export function convertOCRResultToPersonalSchduleData(
  year: number,
  month: number,
  workGroupString: string,
  ocrResult: [string, Record<string, string>][]
): Map<string, WorkType> {
  const personalCalendarData = new Map<string, WorkType>()
  const cleanWorkGroup = workGroupString.replace('조', '')

  const foundSheet = ocrResult.find(([workGroupNumber]) => {
    return workGroupNumber === cleanWorkGroup
  })

  if (!foundSheet) {
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

export function convertOCRResultToTeamScheduleData(
  year: number,
  month: number,
  ocrResult: [string, Record<string, string>][]
): { team: string; date: string; workType: WorkType }[] {
  const teamScheduleData: { team: string; date: string; workType: WorkType }[] =
    []

  ocrResult.forEach(([workGroupNumber, shiftsRecord]) => {
    // "1" -> "1조" 변환
    const teamName = `${workGroupNumber}조`

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

        teamScheduleData.push({
          team: teamName,
          date: fullDate.format('YYYY-MM-DD'),
          workType: shiftCode,
        })
      }
    }
  })

  return teamScheduleData
}
