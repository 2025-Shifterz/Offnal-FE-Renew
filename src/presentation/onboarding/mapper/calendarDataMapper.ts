import { toShiftType } from '../../../data/mappers/ShiftTypeMapper'
import dayjs from 'dayjs'
import { WorkType } from '../../../shared/types/Calendar'
import { OcrResult } from '../../../domain/models/OcrResult'

function normalizeTeamValue(team: string) {
  return team.trim().replace(/조$/, '')
}

function toTeamLabel(team: string) {
  const normalizedTeam = normalizeTeamValue(team)
  return normalizedTeam ? `${normalizedTeam}조` : team
}

function extractDayOfMonth(
  rawDate: string,
  targetYear: number,
  targetMonth: number,
  daysInTargetMonth: number
) {
  const dateString = rawDate.trim()

  if (/^\d+$/.test(dateString)) {
    const dayOfMonth = parseInt(dateString, 10)
    return dayOfMonth >= 1 && dayOfMonth <= daysInTargetMonth
      ? dayOfMonth
      : null
  }

  const fullDateMatch = dateString.match(
    /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/
  )
  if (fullDateMatch) {
    const [, year, month, day] = fullDateMatch
    const parsedYear = parseInt(year, 10)
    const parsedMonth = parseInt(month, 10)
    const parsedDay = parseInt(day, 10)

    if (
      parsedYear === targetYear &&
      parsedMonth === targetMonth &&
      parsedDay >= 1 &&
      parsedDay <= daysInTargetMonth
    ) {
      return parsedDay
    }

    return null
  }

  const monthDayMatch = dateString.match(/^(\d{1,2})[-./](\d{1,2})$/)
  if (monthDayMatch) {
    const [, month, day] = monthDayMatch
    const parsedMonth = parseInt(month, 10)
    const parsedDay = parseInt(day, 10)

    if (
      parsedMonth === targetMonth &&
      parsedDay >= 1 &&
      parsedDay <= daysInTargetMonth
    ) {
      return parsedDay
    }

    return null
  }

  const koreanDayMatch = dateString.match(/^(\d{1,2})일$/)
  if (koreanDayMatch) {
    const parsedDay = parseInt(koreanDayMatch[1], 10)
    return parsedDay >= 1 && parsedDay <= daysInTargetMonth ? parsedDay : null
  }

  return null
}

export function convertOCRResultToPersonalSchduleData(
  year: number,
  month: number,
  workGroupString: string,
  ocrResult: OcrResult | undefined
): Map<string, WorkType> {
  const personalCalendarData = new Map<string, WorkType>()
  const cleanWorkGroup = normalizeTeamValue(workGroupString)

  if (!ocrResult) {
    return personalCalendarData
  }

  const foundSheet = ocrResult.find(item => {
    return normalizeTeamValue(item.team) === cleanWorkGroup
  })

  if (!foundSheet) {
    return personalCalendarData
  }

  const { shifts: shiftsRecord } = foundSheet
  const targetMonthStart = dayjs()
    .year(year)
    .month(month - 1)
    .startOf('month')
  const daysInTargetMonth = targetMonthStart.daysInMonth()

  for (const dateString in shiftsRecord) {
    if (Object.prototype.hasOwnProperty.call(shiftsRecord, dateString)) {
      const shiftCode = toShiftType(shiftsRecord[dateString])
      const dayOfMonth = extractDayOfMonth(
        dateString,
        year,
        month,
        daysInTargetMonth
      )

      if (dayOfMonth === null) {
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
  ocrResult: OcrResult | undefined
): { team: string; date: string; workType: WorkType }[] {
  const teamScheduleData: { team: string; date: string; workType: WorkType }[] =
    []

  if (!ocrResult) {
    return teamScheduleData
  }

  ocrResult.forEach(item => {
    const { team: rawTeam, shifts: shiftsRecord } = item
    const team = toTeamLabel(rawTeam)

    const targetMonthStart = dayjs()
      .year(year)
      .month(month - 1)
      .startOf('month')
    const daysInTargetMonth = targetMonthStart.daysInMonth()

    for (const dateString in shiftsRecord) {
      if (Object.prototype.hasOwnProperty.call(shiftsRecord, dateString)) {
        const shiftCode = toShiftType(shiftsRecord[dateString])
        const dayOfMonth = extractDayOfMonth(
          dateString,
          year,
          month,
          daysInTargetMonth
        )

        if (dayOfMonth === null) {
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
          team,
          date: fullDate.format('YYYY-MM-DD'),
          workType: shiftCode,
        })
      }
    }
  })

  return teamScheduleData
}
