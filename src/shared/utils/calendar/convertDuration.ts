import dayjs from 'dayjs'

export interface InputWorkTimeDetail {
  startTime: string
  endTime: string
}

export interface WorkTimeDuration {
  startTime: string
  duration: string
}

// startTime과 endTime을 받아 PT형식 duration으로 변환
export function convertEndTimeToDuration(
  workTimes: Record<string, InputWorkTimeDetail>
): Record<string, WorkTimeDuration> {
  const todayStr = dayjs().format('YYYY-MM-DD')

  const converted: Record<string, WorkTimeDuration> = {}

  Object.entries(workTimes).forEach(([key, value]) => {
    const { startTime, endTime } = value

    const start = dayjs(`${todayStr} ${startTime}`, 'YYYY-MM-DD HH:mm')
    let end = dayjs(`${todayStr} ${endTime}`, 'YYYY-MM-DD HH:mm')

    if (end.isBefore(start)) {
      end = end.add(1, 'day')
    }

    const durationMinutes = end.diff(start, 'minute')
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    const duration = `PT${hours}H${minutes > 0 ? `${minutes}M` : ''}`

    converted[key] = { startTime, duration }
  })

  return converted
}

// duration을 endTime로 변환하는 함수
export function convertDurationToEndTime(
  startTime: string,
  duration: string
): string {
  if (!duration) {
    console.log('duration is null') // 휴일인 경우
    return ''
  }
  const [hour, min] = startTime.split(':').map(Number)
  const hoursToAdd = parseInt(duration.replace('PT', '').replace('H', ''), 10)
  const endHour = hour + hoursToAdd
  return `${endHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
}
